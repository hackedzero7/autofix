import test from "node:test"
import assert from "node:assert/strict"
import mongoose from "mongoose"
import nextEnv from "@next/env"

nextEnv.loadEnvConfig(process.cwd())
const base = process.env.BLOG_TEST_URL || "http://localhost:3002"
const get = path => fetch(base + path, { signal: AbortSignal.timeout(90000) })

test("public blog, details and sitemap reflect published MongoDB records only", async () => {
  assert.ok(process.env.MONGODB_URI, "MONGODB_URI is required for this integration check")
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    const records = await mongoose.connection.collection("crmblogs").find({}, { projection: { slug: 1, status: 1 } }).toArray()
    const published = records.filter(post => post.status === "published")
    const drafts = records.filter(post => post.status !== "published")
    const listing = await get("/blog")
    assert.equal(listing.status, 200)
    const html = await listing.text()
    assert.ok(!html.includes("Articles are temporarily unavailable"), "Blog query must succeed")
    if (!published.length) assert.ok(html.includes("No articles published yet."))
    for (const post of drafts) assert.ok(!html.includes(post.slug), "Drafts must not leak into listing data")
    const sitemap = await get("/sitemap.xml")
    assert.equal(sitemap.status, 200)
    const xml = await sitemap.text()
    for (const post of published) assert.ok(xml.includes("/blog/" + post.slug))
    for (const post of drafts) assert.ok(!xml.includes("/blog/" + post.slug))
    if (published.length) {
      const detail = await get("/blog/" + published[0].slug)
      const text = await detail.text()
      assert.ok(text.includes('application/ld+json'))
      assert.ok(!text.includes("Article not found"))
    }
    const missing = await get("/blog/" + (drafts[0]?.slug || "unpublished-test-" + Date.now()))
    assert.ok((await missing.text()).includes("Article not found"))
    console.log("Verified published records:", published.length, "private records:", drafts.length)
  } finally { await mongoose.disconnect() }
})
