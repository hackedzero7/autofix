import test from "node:test"
import assert from "node:assert/strict"
import mongoose from "mongoose"
import nextEnv from "@next/env"

nextEnv.loadEnvConfig(process.cwd())
const base = process.env.BLOG_TEST_URL || "http://localhost:3002"
const get = path => fetch(base + path, { headers: { "User-Agent": "Googlebot" }, signal: AbortSignal.timeout(90000) })

test("public blog, details and sitemap reflect published MongoDB records only", async () => {
  assert.ok(process.env.MONGODB_URI, "MONGODB_URI is required for this integration check")
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    const records = await mongoose.connection.collection("crmblogs").find({}, { projection: { slug: 1, status: 1, title: 1, excerpt: 1, noIndex: 1 } }).toArray()
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
    for (const post of published) assert.equal(xml.includes("/blog/" + post.slug), !post.noIndex)
    for (const post of drafts) assert.ok(!xml.includes("/blog/" + post.slug))
    const canonicals = new Set()
    for (const post of published) {
      const detail = await get("/blog/" + post.slug)
      assert.equal(detail.status, 200)
      const text = await detail.text()
      assert.match(text, /rel="canonical"/)
      assert.match(text, /property="og:type" content="article"/)
      const robots = text.match(/name="robots" content="([^"]*)"/)?.[1]
      assert.ok(robots)
      assert.equal(robots.split(",").map(s => s.trim()).includes("noindex"), !!post.noIndex)
      const canonical = text.match(/rel="canonical" href="([^"]*)"/)?.[1]
      assert.ok(canonical.endsWith("/blog/" + post.slug))
      assert.ok(!canonicals.has(canonical)); canonicals.add(canonical)
      const schema = JSON.parse(text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
      assert.equal(schema.headline, post.title)
      assert.equal(schema.url, canonical)
      assert.ok(text.includes('application/ld+json'))
      assert.ok(!text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").includes("Article not found"))
    }
    const missing = await get("/blog/" + (drafts[0]?.slug || "unpublished-test-" + Date.now()))
    assert.equal(missing.status, 404)
    assert.ok((await missing.text()).includes("Article not found"))
    const browserMissing = await fetch(base + "/blog/missing-seo-check-" + Date.now())
    assert.equal(browserMissing.status, 404)
    const home = await get("/")
    assert.equal(home.status, 200)
    assert.ok((await home.text()).includes('id="services"'))
    assert.equal((await get("/black-sports-car-red-lighting.png")).status, 200)
    const slash = await fetch(base + "/blog/", { redirect: "manual" })
    assert.equal(slash.status, 308)
    const robotsResponse = await get("/robots.txt")
    assert.equal(robotsResponse.status, 200)
    assert.match(await robotsResponse.text(), /Sitemap: https?:\/\/.+\/sitemap.xml/)
    console.log("Verified published records:", published.length, "private records:", drafts.length)
  } finally { await mongoose.disconnect() }
})
