import test from 'node:test'
import assert from 'node:assert/strict'
import { articleMetadata, articleStructuredData, articleUrl, blogSitemap, relatedArticles, serializeJsonLd, normalizeSiteUrl } from '../lib/blog-seo.ts'
import { blogInput } from '../lib/crm-validation.ts'
const post = { id: '1', title: 'Battery care', slug: 'battery-care', excerpt: 'Practical battery advice.', category: 'Battery', author: 'Pro Auto Care', readingTime: '3 min', publishedAt: '2026-09-01', keywords: ['battery'], content: [{ paragraphs: ['Keep your battery maintained.'] }] }
test('distinct articles generate distinct metadata and self canonical URLs', () => {
 const a = articleMetadata(post), b = articleMetadata({ ...post, title: 'AC care', slug: 'ac-care', excerpt: 'AC maintenance advice.' })
 assert.notEqual(a.title, b.title); assert.notEqual(a.description, b.description)
 assert.notEqual(a.alternates.canonical, b.alternates.canonical)
 assert.equal(a.openGraph.url, articleUrl(post)); assert.equal(a.robots.index, true)
 assert.equal(a.openGraph.modifiedTime, undefined)
})
test('SEO controls survive validation and noindex posts are excluded from sitemap', () => {
 const parsed = blogInput.parse({ ...post, metaTitle: 'Custom title', metaDescription: 'Custom description', noIndex: true, authorType: 'Organization', status: 'published' })
 assert.equal(articleMetadata(parsed).title, 'Custom title')
 assert.equal(articleMetadata(parsed).robots.index, false)
 assert.equal(blogSitemap([parsed]).length, 2)
 assert.equal(blogSitemap([post, post]).length, 3)
 assert.equal(blogSitemap([post])[2].lastModified, post.publishedAt)
})
test('structured data matches visible content and escapes script termination', () => {
 const data = articleStructuredData({ ...post, title: '</script><script>alert(1)</script>' })
 assert.equal(data.dateModified, post.publishedAt)
 assert.equal(data.author['@type'], 'Organization')
 const json = serializeJsonLd(data)
 assert.ok(!json.includes('<'))
 assert.deepEqual(JSON.parse(json), data)
 assert.equal(data.publisher.logo, undefined)
})
test('related links require topic overlap, exclude self and noindex, and rank relevance', () => {
 const other = { ...post, slug: 'other', category: 'Unrelated', keywords: [] }
 const match = { ...post, slug: 'matching' }
 assert.deepEqual(relatedArticles(post, [post, other, match, { ...match, slug: 'hidden', noIndex: true }]), [match])
})
test('site origin normalizes slashes and removes query and fragment variants', () => {
 assert.equal(normalizeSiteUrl('https://www.proautocare.co/?x=1#test'), 'https://www.proautocare.co')
 for (const url of ['ftp://example.com', 'https://example.com/blog', 'https://user:secret@example.com']) assert.throws(() => normalizeSiteUrl(url))
})
