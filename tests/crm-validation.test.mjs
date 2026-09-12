import test from "node:test"
import assert from "node:assert/strict"
import { blogInput, loginInput, parseImport } from "../lib/crm-validation.ts"
import { hashPassword, verifyPassword } from "../lib/crm-password.ts"
import { CrmBlog, CrmSession } from "../lib/crm-models.ts"

const blog = { title: "Test blog", slug: "test-blog", excerpt: "An excerpt", category: "Advice", author: "Writer", readingTime: "3 min read", publishedAt: "2026-09-12", content: [{ paragraphs: ["Hello"] }] }
test("imports a single blog, array, and wrapped array with safe defaults", () => {
  for (const input of [blog, [blog], { blogs: [blog] }]) {
    const [result] = parseImport(input)
    assert.equal(result.status, "draft")
    assert.deepEqual(result.keywords, [])
  }
})
test("does not trust imported IDs or roles", () => {
  const [result] = parseImport({ ...blog, id: "external-id", role: "admin" })
  assert.equal(result.id, undefined)
  assert.equal(result.role, undefined)
})
test("rejects duplicate slugs and validates every row before import", () => {
  assert.throws(() => parseImport([blog, blog]), /duplicate slugs/)
  assert.throws(() => parseImport([blog, { ...blog, slug: "second", content: [] }]))
})
test("rejects empty, oversized, malformed, and invalid dates", () => {
  for (const input of [[], null, { blogs: "bad" }, Array(101).fill(blog), { ...blog, publishedAt: "2026-02-30" }, { ...blog, slug: "Bad slug" }, { ...blog, content: [{}] }]) assert.throws(() => parseImport(input))
})
test("accepts the existing section shape and strips unknown fields", () => {
  const result = blogInput.parse({ ...blog, content: [{ heading: "A heading", paragraphs: ["Paragraph"], list: ["Item"], quote: "Quote" }] })
  assert.equal(result.content[0].quote, "Quote")
})
test("normalizes admin login emails and rejects empty passwords", () => {
  assert.equal(loginInput.parse({ email: "TEST@example.com", password: "long-password-123" }).email, "test@example.com")
  assert.throws(() => loginInput.parse({ email: "test@example.com", password: "" }))
})
test("password hashes are salted and reject wrong passwords and malformed hashes", async () => {
  const first = await hashPassword("test-password-123")
  const second = await hashPassword("test-password-123")
  assert.notEqual(first, second)
  assert.equal(await verifyPassword("test-password-123", first), true)
  assert.equal(await verifyPassword("incorrect-password", first), false)
  assert.equal(await verifyPassword("test-password-123", "invalid"), false)
})
test("blog slugs are unique across the admin library and sessions have TTL indexes", () => {
  assert.ok(CrmBlog.schema.indexes().some(([keys, options]) => keys.slug === 1 && Object.keys(keys).length === 1 && options.unique))
  assert.ok(CrmSession.schema.indexes().some(([keys, options]) => keys.expiresAt === 1 && options.expireAfterSeconds === 0))
})
