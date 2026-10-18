import test from "node:test"
import assert from "node:assert/strict"
import { createBlogToolHandlers, registerBlogTools, blogJsonSchema, blogWritingGuide } from "../lib/mcp-blog-tools.ts"

const auth = { userId: "admin-id", scopes: ["blogs:read", "blogs:write", "blogs:delete"], clientId: "test-agent" }
const article = {
  title: "Battery care in Abu Dhabi", slug: "battery-care-abu-dhabi", excerpt: "Practical battery maintenance advice.", category: "Battery",
  author: "Pro Auto Care", authorType: "Organization", readingTime: "3 min read", publishedAt: "2026-10-18",
  content: [{ heading: "Check your battery", paragraphs: ["Follow the vehicle manufacturer's maintenance guidance."] }],
}
const data = value => value.structuredContent || JSON.parse(value.content[0].text)

function memoryRepository(initial = []) {
  const rows = new Map(initial.map(post => [post.slug, structuredClone(post)]))
  const calls = []
  let tick = 0
  const revision = () => new Date(Date.UTC(2026, 9, 18, 0, 0, ++tick)).toISOString()
  return {
    rows, calls,
    async list(input) {
      calls.push(["list", input])
      const selected = [...rows.values()].filter(post => (!input.status || post.status === input.status) && (!input.search || `${post.title} ${post.slug} ${post.excerpt} ${post.category} ${post.keywords}`.includes(input.search)))
      return { posts: selected.slice((input.page - 1) * input.limit, input.page * input.limit).map(({ content, ...summary }) => summary), total: selected.length }
    },
    async get(slug) { calls.push(["get", slug]); return structuredClone(rows.get(slug) || null) },
    async create(post) {
      calls.push(["create", post])
      if (rows.has(post.slug)) throw Object.assign(new Error("private Mongo key detail"), { code: 11000 })
      const stored = { ...structuredClone(post), id: String(rows.size + 1), updatedAt: revision() }
      rows.set(post.slug, stored)
      return structuredClone(stored)
    },
    async update(slug, expectedUpdatedAt, post) {
      calls.push(["update", slug])
      const current = rows.get(slug)
      if (!current || current.updatedAt !== expectedUpdatedAt) return null
      if (post.slug !== slug && rows.has(post.slug)) throw Object.assign(new Error("private Mongo index details"), { code: 11000 })
      const stored = { ...structuredClone(post), id: current.id, updatedAt: revision() }
      rows.delete(slug); rows.set(post.slug, stored)
      return structuredClone(stored)
    },
    async delete(slug, expectedUpdatedAt) {
      calls.push(["delete", slug])
      if (rows.get(slug)?.updatedAt !== expectedUpdatedAt) return false
      return rows.delete(slug)
    },
  }
}

test("every operation checks its scope before parsing arguments or accessing stored articles", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers({ userId: "admin", scopes: [] }, repository)
  for (const handler of Object.values(handlers)) {
    const result = await handler(null)
    assert.equal(result.isError, true)
    assert.equal(data(result).error.code, "FORBIDDEN")
  }
  assert.deepEqual(repository.calls, [])
  const readOnly = createBlogToolHandlers({ userId: "admin", scopes: ["blogs:read"] }, repository)
  assert.equal(data(await readOnly.create({ post: article })).error.code, "FORBIDDEN")
})

test("validation uses the website section schema and reports SEO warnings without writing", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers(auth, repository)
  const validated = data(await handlers.validate({ post: { ...article, noIndex: true, metaDescription: "x".repeat(170) } }))
  assert.equal(validated.valid, true)
  assert.equal(validated.post.status, "draft")
  assert.deepEqual(validated.post.keywords, [])
  assert.equal(validated.warnings.length, 3)
  for (const post of [{ ...article, content: [{}] }, { ...article, publishedAt: "2026-02-30" }, { ...article, slug: "Unsafe slug" }, { ...article, image: "https://example.com/file.png" }]) {
    const invalid = await handlers.validate({ post })
    assert.equal(invalid.isError, true)
    assert.equal(data(invalid).error.code, "INVALID_INPUT")
  }
  assert.deepEqual(repository.calls, [])
})

test("creation defaults to draft, supports explicit publication, and retries never overwrite", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers(auth, repository)
  const created = data(await handlers.create({ post: article }))
  assert.equal(created.created, true)
  assert.equal(created.post.status, "draft")
  const retried = data(await handlers.create({ post: { ...article, title: "Different retry text", status: "published" } }))
  assert.equal(retried.created, false)
  assert.equal(retried.post.title, article.title)
  assert.equal(retried.post.status, "draft")
  assert.equal(repository.rows.size, 1)
  const published = data(await handlers.create({ post: { ...article, slug: "explicit-publication", status: "published" } }))
  assert.equal(published.post.status, "published")
})

test("the database unique index resolves simultaneous same-slug creations safely", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers(auth, repository)
  const results = await Promise.all([handlers.create({ post: article }), handlers.create({ post: article })])
  assert.equal(repository.rows.size, 1)
  assert.equal(results.filter(result => data(result).created === true).length, 1)
  assert.equal(results.filter(result => data(result).created === false).length, 1)
  assert.ok(results.every(result => !result.isError))
})

test("partial edits retain publication and tags and reject stale updates", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers(auth, repository)
  const created = data(await handlers.create({ post: { ...article, status: "published", keywords: ["battery", "Abu Dhabi"], noIndex: true } })).post
  const updated = data(await handlers.update({ slug: article.slug, expectedUpdatedAt: created.updatedAt, changes: { title: "Updated title", noIndex: false } })).post
  assert.equal(updated.title, "Updated title")
  assert.equal(updated.status, "published")
  assert.deepEqual(updated.keywords, ["battery", "Abu Dhabi"])
  assert.equal(updated.noIndex, false)
  assert.match(updated.modifiedAt, /^\d{4}-\d{2}-\d{2}$/)
  assert.notEqual(updated.updatedAt, created.updatedAt)
  const stale = await handlers.update({ slug: article.slug, expectedUpdatedAt: created.updatedAt, changes: { title: "Lost edit" } })
  assert.equal(data(stale).error.code, "CONFLICT")
  assert.equal(repository.rows.get(article.slug).title, "Updated title")
  assert.equal(data(await handlers.update({ slug: article.slug, expectedUpdatedAt: updated.updatedAt, changes: {} })).error.code, "INVALID_INPUT")
})

test("an edit racing after the initial read still fails atomically", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers(auth, repository)
  const current = data(await handlers.create({ post: article })).post
  repository.update = async () => null
  const result = await handlers.update({ slug: current.slug, expectedUpdatedAt: current.updatedAt, changes: { excerpt: "A new excerpt" } })
  assert.equal(data(result).error.code, "CONFLICT")
})

test("deletion requires its own scope, exact slug confirmation and the latest revision", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers(auth, repository)
  const current = data(await handlers.create({ post: article })).post
  const args = { slug: current.slug, expectedUpdatedAt: current.updatedAt, confirmationSlug: current.slug }
  assert.equal(data(await handlers.delete({ ...args, confirmationSlug: "different-slug" })).error.code, "CONFIRMATION_REQUIRED")
  assert.equal(data(await handlers.delete({ ...args, expectedUpdatedAt: "2026-10-17T00:00:00.000Z" })).error.code, "CONFLICT")
  assert.equal(repository.rows.size, 1)
  const writeOnly = createBlogToolHandlers({ userId: "admin", scopes: ["blogs:write"] }, repository)
  assert.equal(data(await writeOnly.delete(args)).error.code, "FORBIDDEN")
  assert.equal(data(await handlers.delete(args)).deleted, true)
  assert.equal(repository.rows.size, 0)
  assert.equal(data(await handlers.delete(args)).error.code, "NOT_FOUND")
})

test("list forwards bounded search/pagination, omits bodies and returns page metadata", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers(auth, repository)
  for (let index = 0; index < 3; index++) await handlers.create({ post: { ...article, slug: `battery-care-${index}` } })
  const page = data(await handlers.list({ search: "battery", status: "draft", page: 2, limit: 1 }))
  assert.equal(page.posts.length, 1)
  assert.equal(page.posts[0].content, undefined)
  assert.equal(page.page, 2)
  assert.equal(page.total, 3)
  assert.equal(page.totalPages, 3)
  assert.equal(page.hasMore, true)
  assert.equal(data(await handlers.list({ limit: 51 })).error.code, "INVALID_INPUT")
  assert.equal(data(await handlers.list({ page: 0 })).error.code, "INVALID_INPUT")
  assert.equal(data(await handlers.list({ search: { $ne: null } })).error.code, "INVALID_INPUT")
})

test("service errors never expose database strings and duplicate renames are explicit", async () => {
  const repository = memoryRepository()
  const handlers = createBlogToolHandlers(auth, repository)
  const current = data(await handlers.create({ post: article })).post
  await handlers.create({ post: { ...article, slug: "existing-target" } })
  const duplicate = await handlers.update({ slug: current.slug, expectedUpdatedAt: current.updatedAt, changes: { slug: "existing-target" } })
  assert.equal(data(duplicate).error.code, "SLUG_EXISTS")
  assert.ok(!JSON.stringify(duplicate).includes("private Mongo"))
  repository.get = async () => { throw new Error("mongodb://admin:secret@private-host") }
  const failed = await handlers.get({ slug: article.slug })
  assert.equal(data(failed).error.code, "SERVICE_UNAVAILABLE")
  assert.ok(!JSON.stringify(failed).includes("secret"))
})

test("whole-article limits protect tool responses even when individual fields fit", async () => {
  const handlers = createBlogToolHandlers(auth, memoryRepository())
  const result = await handlers.validate({ post: { ...article, content: [{ paragraphs: Array(20).fill("x".repeat(20000)) }] } })
  assert.equal(data(result).error.code, "ARTICLE_TOO_LARGE")
})

test("tool registrations expose the actual schema, guide and exactly-two weekly prompt", async () => {
  const tools = new Map(), resources = new Map(), prompts = new Map()
  const server = {
    registerTool(name, options, callback) { tools.set(name, { options, callback }) },
    registerResource(name, uri, options, callback) { resources.set(uri, { options, callback }) },
    registerPrompt(name, options, callback) { prompts.set(name, { options, callback }) },
  }
  registerBlogTools(server, auth, memoryRepository())
  assert.deepEqual([...tools.keys()], ["blogs_list", "blogs_get", "blogs_validate", "blogs_create", "blogs_update", "blogs_delete"])
  assert.equal(tools.get("blogs_delete").options.annotations.destructiveHint, true)
  const schema = JSON.parse((await resources.get("blog://schema").callback(new URL("blog://schema"))).contents[0].text)
  assert.deepEqual(schema, blogJsonSchema)
  assert.equal(schema.properties.status.default, "draft")
  assert.equal(schema.properties.content.items.properties.paragraphs.items.maxLength, 20000)
  const guide = JSON.parse((await resources.get("blog://writing-guide").callback(new URL("blog://writing-guide"))).contents[0].text)
  assert.deepEqual(guide, blogWritingGuide)
  assert.match(guide.media, /no per-article image/)
  const prompt = await prompts.get("weekly_articles").callback({ weekStart: "2026-10-19" })
  assert.match(prompt.messages[0].content.text, /exactly two original/)
  assert.match(prompt.messages[0].content.text, /explicit status draft/)
})
