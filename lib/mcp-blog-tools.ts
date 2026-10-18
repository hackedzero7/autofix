import { z } from "zod"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import { blogInput } from "./crm-validation"

export type McpBlogAuth = { userId: string; scopes: string[]; clientId?: string }
export type BlogInput = z.infer<typeof blogInput>
export type StoredBlog = BlogInput & { id: string; createdAt?: string; updatedAt: string }
export type BlogSummary = Omit<StoredBlog, "content">
type ListInput = { search?: string; status?: "draft" | "published"; page: number; limit: number }

// Injection keeps domain tests independent of MongoDB and of real website content.
export interface BlogRepository {
  list(input: ListInput): Promise<{ posts: BlogSummary[]; total: number }>
  get(slug: string): Promise<StoredBlog | null>
  create(post: BlogInput): Promise<StoredBlog>
  update(slug: string, expectedUpdatedAt: string, post: BlogInput): Promise<StoredBlog | null>
  delete(slug: string, expectedUpdatedAt: string): Promise<boolean>
}

const slugInput = blogInput.shape.slug
const updatedAtInput = z.string().datetime({ offset: true }).describe("Exact updatedAt returned by blogs_get; protects against overwriting a newer edit.")
const fullPostInput = blogInput.strict()
const summaryInput = blogInput.omit({ content: true })
const changesInput = blogInput.partial().strict().refine(value => Object.keys(value).length > 0, "Provide at least one field to change")
const MAX_POST_BYTES = 256 * 1024

export const blogToolInputs = {
  list: z.object({
    search: z.string().trim().min(1).max(160).optional().describe("Literal text matched against title, slug, excerpt, category, or keywords."),
    status: z.enum(["draft", "published"]).optional(),
    page: z.number().int().min(1).max(10000).default(1),
    limit: z.number().int().min(1).max(50).default(20),
  }).strict(),
  get: z.object({ slug: slugInput }).strict(),
  validate: z.object({ post: fullPostInput }).strict(),
  create: z.object({ post: fullPostInput }).strict(),
  update: z.object({ slug: slugInput, expectedUpdatedAt: updatedAtInput, changes: changesInput }).strict(),
  delete: z.object({ slug: slugInput, expectedUpdatedAt: updatedAtInput, confirmationSlug: slugInput.describe("Repeat the exact slug to explicitly confirm permanent deletion.") }).strict(),
}

class BlogToolError extends Error {
  code: string
  constructor(code: string, message: string) { super(message); this.code = code }
}

const result = (data: Record<string, unknown>): CallToolResult => ({
  content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data,
})
const success = (data: Record<string, unknown>) => result({ ok: true, ...data })

function requireScope(auth: McpBlogAuth, scope: string) {
  if (!auth.userId || !auth.scopes.includes(scope)) throw new BlogToolError("FORBIDDEN", `This operation requires the ${scope} permission.`)
}

function safeError(error: unknown): CallToolResult {
  let data: Record<string, unknown>
  if (error instanceof BlogToolError) data = { code: error.code, message: error.message }
  else if (error instanceof z.ZodError) data = {
    code: "INVALID_INPUT", message: "The article or tool arguments failed validation.",
    issues: error.issues.slice(0, 20).map(issue => ({ path: issue.path.join("."), message: issue.message })),
  }
  else if (error && typeof error === "object" && "code" in error && error.code === 11000) {
    data = { code: "SLUG_EXISTS", message: "An article already uses that slug. Read it with blogs_get before updating it." }
  } else data = { code: "SERVICE_UNAVAILABLE", message: "The blog operation could not be completed. Please retry later." }
  return { ...result({ ok: false, error: data }), isError: true }
}

function checkPostSize(post: BlogInput) {
  if (Buffer.byteLength(JSON.stringify(post), "utf8") > MAX_POST_BYTES) {
    throw new BlogToolError("ARTICLE_TOO_LARGE", "An article must fit within 256 KiB of UTF-8 JSON.")
  }
}

/** Domain handlers always authorize before parsing input or reading any stored data. */
export function createBlogToolHandlers(auth: McpBlogAuth, repository: BlogRepository = mongoBlogRepository) {
  const guarded = (scope: string, action: (input: unknown) => Promise<CallToolResult>) => async (input: unknown) => {
    try { requireScope(auth, scope); return await action(input) } catch (error) { return safeError(error) }
  }
  return {
    list: guarded("blogs:read", async raw => {
      const input = blogToolInputs.list.parse(raw)
      const { posts, total } = await repository.list(input)
      return success({ posts, page: input.page, limit: input.limit, total, totalPages: Math.ceil(total / input.limit), hasMore: input.page * input.limit < total })
    }),
    get: guarded("blogs:read", async raw => {
      const { slug } = blogToolInputs.get.parse(raw)
      const post = await repository.get(slug)
      if (!post) throw new BlogToolError("NOT_FOUND", "The article was not found.")
      return success({ post })
    }),
    validate: guarded("blogs:read", async raw => {
      const { post } = blogToolInputs.validate.parse(raw)
      checkPostSize(post)
      return success({ valid: true, post, warnings: editorialWarnings(post) })
    }),
    create: guarded("blogs:write", async raw => {
      const { post } = blogToolInputs.create.parse(raw)
      checkPostSize(post)
      const existing = await repository.get(post.slug)
      if (existing) return success({ created: false, post: existing, notice: "This slug already exists. The existing article was not changed; use blogs_update to edit it." })
      try {
        return success({ created: true, post: await repository.create(post) })
      } catch (error) {
        // A concurrent retry can win after the first existence check. The unique
        // Mongo index is the final duplicate guard; never overwrite on a retry.
        if (error && typeof error === "object" && "code" in error && error.code === 11000) {
          const existing = await repository.get(post.slug)
          if (existing) return success({ created: false, post: existing, notice: "This slug already exists. The existing article was not changed; use blogs_update to edit it." })
        }
        throw error
      }
    }),
    update: guarded("blogs:write", async raw => {
      const { slug, expectedUpdatedAt, changes } = blogToolInputs.update.parse(raw)
      const current = await repository.get(slug)
      if (!current) throw new BlogToolError("NOT_FOUND", "The article was not found.")
      if (new Date(current.updatedAt).getTime() !== new Date(expectedUpdatedAt).getTime()) {
        throw new BlogToolError("CONFLICT", "The article changed after it was read. Fetch it again before editing.")
      }
      // Parse the merged article, not a default-filled partial: an omitted status
      // or keywords field must never unpublish a post or erase its existing tags.
      const post = fullPostInput.parse({ ...blogInput.parse(current), ...changes, modifiedAt: new Date().toISOString().slice(0, 10) })
      checkPostSize(post)
      const updated = await repository.update(slug, expectedUpdatedAt, post)
      if (!updated) throw new BlogToolError("CONFLICT", "The article changed or was removed during this edit. Fetch it again before retrying.")
      return success({ post: updated })
    }),
    delete: guarded("blogs:delete", async raw => {
      const { slug, expectedUpdatedAt, confirmationSlug } = blogToolInputs.delete.parse(raw)
      if (confirmationSlug !== slug) throw new BlogToolError("CONFIRMATION_REQUIRED", "confirmationSlug must exactly match the slug being deleted.")
      const current = await repository.get(slug)
      if (!current) throw new BlogToolError("NOT_FOUND", "The article was not found.")
      if (!await repository.delete(slug, expectedUpdatedAt)) throw new BlogToolError("CONFLICT", "The article changed during deletion. Fetch it again and confirm the current article.")
      return success({ deleted: true, slug })
    }),
  }
}

function editorialWarnings(post: BlogInput) {
  const warnings: string[] = []
  if ((post.metaTitle || post.title).length > 60) warnings.push("The search title exceeds the usual 60-character editorial target.")
  if ((post.metaDescription || post.excerpt).length > 160) warnings.push("The search description exceeds the usual 160-character editorial target.")
  if (!post.keywords.length) warnings.push("Add relevant keywords to support related-article matching.")
  if (post.noIndex) warnings.push("noIndex is true; the published article will be excluded from the sitemap and search indexing.")
  return warnings
}

const textSchema = { type: "string", minLength: 1, maxLength: 300 }
const sectionSchema = {
  type: "object", additionalProperties: false,
  properties: {
    heading: textSchema,
    paragraphs: { type: "array", maxItems: 100, items: { type: "string", minLength: 1, maxLength: 20000 } },
    list: { type: "array", maxItems: 100, items: { type: "string", minLength: 1, maxLength: 5000 } },
    quote: { type: "string", minLength: 1, maxLength: 5000 },
  },
  anyOf: [
    { required: ["heading"] }, { required: ["quote"] },
    { required: ["paragraphs"], properties: { paragraphs: { minItems: 1 } } },
    { required: ["list"], properties: { list: { minItems: 1 } } },
  ],
}

export const blogJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema", title: "Pro Auto Care blog article",
  type: "object", additionalProperties: false,
  required: ["title", "slug", "excerpt", "category", "author", "readingTime", "publishedAt", "content"],
  properties: {
    title: textSchema, slug: { type: "string", minLength: 1, maxLength: 180, pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    excerpt: { type: "string", minLength: 1, maxLength: 2000 }, category: textSchema, author: textSchema, readingTime: textSchema,
    publishedAt: { type: "string", format: "date", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    modifiedAt: { type: "string", format: "date", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    keywords: { type: "array", maxItems: 50, items: textSchema, default: [] },
    content: { type: "array", minItems: 1, maxItems: 100, items: sectionSchema },
    metaTitle: textSchema, metaDescription: { type: "string", minLength: 1, maxLength: 2000 },
    noIndex: { type: "boolean" }, authorType: { type: "string", enum: ["Person", "Organization"] },
    status: { type: "string", enum: ["draft", "published"], default: "draft" },
  },
}

export const blogWritingGuide = {
  site: "Pro Auto Care", audience: "Drivers in Abu Dhabi and the UAE", representation: "Plain text in ordered content sections; HTML and Markdown are not rendered.",
  fields: {
    title: "Visible article title. Be descriptive and accurate.", slug: "Unique lowercase URL identifier with hyphens; public URL is /blog/{slug}.",
    excerpt: "Visible blog-card summary; also the SEO description fallback.", category: "Visible topic, e.g. Battery, AC Repair, or Maintenance.",
    author: "Real approved author or Pro Auto Care; use authorType Organization for a company author.", readingTime: "Human-readable estimate, e.g. 5 min read; calculate from the actual article.",
    publishedAt: "Real calendar date YYYY-MM-DD. This is a display date, not a scheduler: status published makes an article public immediately, even with a future date.",
    modifiedAt: "Optional date on creation; server sets the current UTC date on every update.",
    keywords: "Up to 50 relevant phrases; used in metadata and related-article matching. Prefer a small specific set.",
    content: "1-100 ordered section objects with optional heading, paragraphs, list, and quote. Each section must contain something. Paragraphs and list are arrays of plain strings.",
    metaTitle: "Optional search/social title; defaults to title. Aim for about 50-60 characters without keyword stuffing.",
    metaDescription: "Optional search/social description; defaults to excerpt. Aim for about 140-160 characters.",
    noIndex: "Optional boolean. true excludes the article from sitemap and requests search noindex; omit or false for normal indexing.",
    authorType: "Person or Organization; use the factual author identity.",
    status: "draft by default; explicitly set published only when publication is authorized. Drafts are private to the admin/API.",
  },
  limits: "Existing validation limits are in blog://schema. MCP additionally caps a whole article at 256 KiB of UTF-8 JSON.",
  media: "This website currently has no per-article image, file, attachment, or blob fields. Do not send image URLs, binary uploads, or data URIs. Blog social sharing uses the existing site-wide image.",
  workflow: [
    "Read blogs_list, including recent drafts, and inspect relevant posts with blogs_get before planning subjects.",
    "For each requested week prepare exactly two distinct useful articles, avoiding duplicate subjects and slugs. Research current factual claims using available trustworthy sources; do not invent sources, prices, offers, qualifications, or service promises.",
    "Use a short introduction, practical subheadings, helpful paragraphs and lists, and an accurate service call to action. Use normal plain text; section text is escaped by the website.",
    "Use blogs_validate before blogs_create. Prefer draft unless the task explicitly authorizes publication. Reusing a slug returns the existing article without modifying it.",
    "Fetch the latest article before editing/deleting and pass its updatedAt as expectedUpdatedAt. Update changes contain only fields to change; omitted fields retain their values.",
    "For permanent deletion repeat the exact slug in confirmationSlug. A connector does not schedule itself: configure the agent platform's recurring task for two articles each week.",
  ],
  example: {
    title: "How Abu Dhabi Heat Affects Your Car Battery", slug: "abu-dhabi-heat-car-battery-care", excerpt: "Practical battery care checks for hot-weather driving in Abu Dhabi.",
    category: "Battery", author: "Pro Auto Care", authorType: "Organization", readingTime: "4 min read", publishedAt: "2026-10-18",
    keywords: ["car battery care", "Abu Dhabi"], status: "draft",
    content: [{ heading: "Start with regular checks", paragraphs: ["Use researched, original advice here and follow your vehicle manufacturer's maintenance guidance."], list: ["Check for visible damage without touching exposed battery components."] }],
  },
}

export function registerBlogTools(server: McpServer, auth: McpBlogAuth, repository: BlogRepository = mongoBlogRepository) {
  const handlers = createBlogToolHandlers(auth, repository)
  server.registerTool("blogs_list", { title: "List blog articles", description: "Search draft and published article summaries with bounded pagination. Content is omitted; use blogs_get for the full article.", inputSchema: blogToolInputs.list.shape, annotations: { readOnlyHint: true, openWorldHint: false } }, handlers.list)
  server.registerTool("blogs_get", { title: "Read a blog article", description: "Read the full article by slug, including draft status and updatedAt for safe editing.", inputSchema: blogToolInputs.get.shape, annotations: { readOnlyHint: true, openWorldHint: false } }, handlers.get)
  server.registerTool("blogs_validate", { title: "Validate a blog article", description: "Check the existing website content schema and SEO guidance without saving. Return normalized defaults; draft is the default status.", inputSchema: blogToolInputs.validate.shape, annotations: { readOnlyHint: true, openWorldHint: false } }, handlers.validate)
  server.registerTool("blogs_create", { title: "Create a blog article", description: "Save a validated article, as draft unless explicitly published. Reusing a slug returns the existing article without modifying it. Read blog://writing-guide first.", inputSchema: blogToolInputs.create.shape, annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false } }, handlers.create)
  server.registerTool("blogs_update", { title: "Update a blog article", description: "Change only supplied fields. Fetch the latest updatedAt and pass expectedUpdatedAt. An explicit changes.status can publish or unpublish. modifiedAt is maintained automatically.", inputSchema: blogToolInputs.update.shape, annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false } }, handlers.update)
  server.registerTool("blogs_delete", { title: "Delete a blog article", description: "Permanently delete one article. Requires its current expectedUpdatedAt and the exact slug repeated in confirmationSlug.", inputSchema: blogToolInputs.delete.shape, annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false } }, handlers.delete)
  server.registerResource("blog_schema", "blog://schema", { title: "Blog article JSON schema", mimeType: "application/json", description: "Actual supported fields, defaults and validation limits for blog article payloads." }, async uri => {
    requireScope(auth, "blogs:read")
    return { contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(blogJsonSchema, null, 2) }] }
  })
  server.registerResource("blog_writing_guide", "blog://writing-guide", { title: "Blog content and SEO guide", mimeType: "application/json", description: "Website content format, SEO field behavior, editing workflow, and two-article weekly publishing guidance." }, async uri => {
    requireScope(auth, "blogs:read")
    return { contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(blogWritingGuide, null, 2) }] }
  })
  server.registerPrompt("weekly_articles", {
    title: "Prepare two weekly articles", description: "Plan, validate and save exactly two original articles for the requested week. Running/scheduling the prompt remains the calling agent's responsibility.",
    argsSchema: { weekStart: blogInput.shape.publishedAt.describe("Week start date, YYYY-MM-DD."), topics: z.string().max(2000).optional(), author: z.string().min(1).max(300).optional(), publish: z.enum(["draft", "published"]).optional() },
  }, async ({ weekStart, topics, author, publish }) => {
    requireScope(auth, "blogs:read")
    return { messages: [{ role: "user", content: { type: "text", text: `Prepare exactly two original Pro Auto Care articles for the week starting ${weekStart}, for drivers in Abu Dhabi and the UAE. Read blog://schema and blog://writing-guide, inspect recent posts with blogs_list, and avoid duplicate slugs or coverage. ${topics ? `Requested subjects: ${topics}. ` : "Choose two distinct useful automotive care subjects. "}${author ? `Approved author: ${author}. ` : "Use Pro Auto Care as the organization author. "}Research factual claims; do not invent prices, service promises or references. Use the supported plain-text section format and appropriate SEO fields. Validate each full payload with blogs_validate, then use blogs_create with explicit status ${publish || "draft"}. Publication dates are display dates, not scheduled visibility. Return the two saved slugs, statuses and any unresolved factual questions. Do not edit or delete existing articles as part of this task.` } }] }
  })
}

function timestamp(value: unknown): string | undefined {
  if (!(typeof value === "string" || value instanceof Date)) return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
}

function blogMetadata(document: Record<string, unknown>) {
  const updatedAt = timestamp(document.updatedAt)
  if (!updatedAt) throw new Error("Article revision is unavailable")
  return { id: String(document._id), createdAt: timestamp(document.createdAt), updatedAt }
}

function storedBlog(document: Record<string, unknown>): StoredBlog {
  return { ...blogInput.parse(document), ...blogMetadata(document) }
}

async function blogModel() {
  const [{ connectDB }, { CrmBlog }] = await Promise.all([import("./mongodb"), import("./crm-models")])
  await connectDB()
  return CrmBlog
}

export const mongoBlogRepository: BlogRepository = {
  async list({ search, status, page, limit }) {
    const model = await blogModel()
    const filter: Record<string, unknown> = status ? { status } : {}
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      filter.$or = ["title", "slug", "excerpt", "category", "keywords"].map(field => ({ [field]: { $regex: escaped, $options: "i" } }))
    }
    const [documents, total] = await Promise.all([
      model.find(filter).select("-content -__v").sort({ updatedAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).lean<Record<string, unknown>[]>(),
      model.countDocuments(filter),
    ])
    // The list projection deliberately excludes the potentially large body.
    const posts = documents.map(document => ({ ...summaryInput.parse(document), ...blogMetadata(document) }))
    return { posts, total }
  },
  async get(slug) {
    const model = await blogModel()
    const document = await model.findOne({ slug }).lean<Record<string, unknown> | null>()
    return document ? storedBlog(document) : null
  },
  async create(post) {
    const model = await blogModel()
    await model.init()
    return storedBlog((await model.create(post)).toObject())
  },
  async update(slug, expectedUpdatedAt, post) {
    const model = await blogModel()
    // Advance the revision even if two writes land within one millisecond.
    const updatedAt = new Date(Math.max(Date.now(), new Date(expectedUpdatedAt).getTime() + 1))
    const document = await model.findOneAndUpdate({ slug, updatedAt: new Date(expectedUpdatedAt) }, { $set: { ...post, updatedAt } }, { new: true, runValidators: true, timestamps: false }).lean<Record<string, unknown> | null>()
    return document ? storedBlog(document) : null
  },
  async delete(slug, expectedUpdatedAt) {
    const model = await blogModel()
    const result = await model.deleteOne({ slug, updatedAt: new Date(expectedUpdatedAt) })
    return result.deletedCount === 1
  },
}
