import { z } from "zod"

const text = z.string().trim().min(1).max(300)
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}, "Use a valid YYYY-MM-DD date")
export const blogInput = z.object({
  title: text, slug: z.string().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  excerpt: z.string().trim().min(1).max(2000), category: text, author: text,
  readingTime: text, publishedAt: date, modifiedAt: date.optional(),
  keywords: z.array(text).max(50).default([]),
  content: z.array(z.object({
    heading: text.optional(), paragraphs: z.array(z.string().trim().min(1).max(20000)).max(100).optional(),
    list: z.array(z.string().trim().min(1).max(5000)).max(100).optional(),
    quote: z.string().trim().min(1).max(5000).optional(),
  }).refine(s => Boolean(s.heading || s.paragraphs?.length || s.list?.length || s.quote), "Section cannot be empty")).min(1).max(100),
  status: z.enum(["draft", "published"]).default("draft"),
})
export const loginInput = z.object({ email: z.string().trim().email().max(254).transform(v => v.toLowerCase()), password: z.string().min(1).max(128) })
export function parseImport(value: unknown) {
  const raw = Array.isArray(value) ? value : value && typeof value === "object" && "blogs" in value ? value.blogs : [value]
  const posts = z.array(blogInput).min(1).max(100).parse(raw)
  if (new Set(posts.map(p => p.slug)).size !== posts.length) throw new Error("The import contains duplicate slugs.")
  return posts
}

export const deleteAllBlogsInput = z.object({ confirmation: z.literal("DELETE_ALL_BLOGS") })
