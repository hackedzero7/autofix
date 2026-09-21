# Blog SEO

The existing Next.js 15.2.8 App Router and MongoDB/CRM architecture is retained. `getPublishedBlogs` and `getPublishedBlogBySlug` read published records at request time; React request caching shares article reads with metadata. Publishing a new valid record automatically supplies its metadata, canonical, structured data, listing entry and sitemap entry without a rebuild.

## Data and metadata

`lib/blog-seo.ts` uses the native Next.js Metadata API. Title and description use `metaTitle → title` and `metaDescription → excerpt`. The root title template appends the brand once. Author, category, dates and keyword context come from the record; no primary keyword is inferred. Keywords are not a ranking guarantee or a reason to alter article copy.

The only optional additions to BlogPost are `metaTitle`, `metaDescription`, `noIndex`, and `authorType` (`Person` or `Organization`). These are supported end to end by CRM JSON imports, exports, validation, persistence and public reads. Existing records need no migration or manual SEO fields. The current editor preserves these fields when editing imported records; overrides can be set through JSON import or the authenticated API. Identify team authors with `authorType: "Organization"`; the exact brand name is automatically recognized, and other author names default to Person without invented biographical information.

Canonicals use the validated configured origin plus `/blog/` plus the existing validated slug. Query strings and fragments from the configured origin are stripped, paths/credentials/non-HTTP URLs are rejected, and Next.js redirects trailing-slash variants. No arbitrary canonical override is provided, so articles remain self-canonical.

Open Graph and Twitter use the existing public car image as a brand fallback. Its actual dimensions are 1024×573. There is no article-specific image source. The generic social image is deliberately not presented as an article image in structured data.

`BlogPosting` JSON-LD uses the visible title, excerpt, author, category, publication date, real brand publisher and canonical. Modified date falls back to publication only in JSON-LD. The placeholder logo is omitted. Serialization escapes `<` to prevent script termination. There is no breadcrumb trail in the UI, so no misleading BreadcrumbList is emitted.

## Rendering, linking and crawl controls

One article H1, section H2s, paragraphs, lists and blockquotes are retained. Related articles are ranked by shared category and keywords, excluding unrelated, current and noindex articles. Related headings use H2/H3. Card links name their destination. The service CTA links to the existing `/#services` section. Category pages and separate service pages do not exist, so none are fabricated.

The dynamic sitemap includes home, blog and unique published indexable article URLs, using actual article dates rather than the current time. Drafts are excluded by the data source; noindex articles are excluded by the generator. Robots allows public pages and assets and references the same canonical sitemap origin. Noindex is a page-level control; it does not block crawling or make a published article private.

The two blog `loading.tsx` boundaries were removed because they flushed HTTP 200 before missing-article resolution. Blocking metadata and `notFound()` now allow a proper 404 before headers are sent. The completed-page styling and responsive layout remain intact; the automatic route skeleton no longer appears while waiting for blog data.

## Slug changes

Before renaming a published slug, add its old-to-new mapping to `data/blog-redirects.json`, for example `{"old-battery-guide":"new-battery-guide"}`, and deploy alongside the change. Next.js emits a permanent 308 redirect. Keep old slugs reserved, point every historical alias directly to the final published slug, and verify the destination exists. Chains, cycles and malformed slugs fail configuration validation. History cannot be inferred from existing records, and CRM slug edits do not automatically update this file. The map starts empty because no historical URLs were supplied.

## Configuration

- `NEXT_PUBLIC_SITE_URL`: existing setting; defaults to the project's `https://www.proautocare.co`. Set the actual production origin before building. Rebuild if it changes, including the static robots route.
- `MONGODB_URI`: existing requirement for all blog reads.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: existing optional Search Console verification.
- `BLOG_TEST_URL`: optional test target; defaults to `http://localhost:3002`.

No new required environment variables. Nodemailer type definitions were added to fix the existing TypeScript error. The build already skips TypeScript validation, so run the independent type check below.

## Practical verification

1. Run `npx tsc --noEmit --incremental false` and `node --test tests/blog-seo.test.mjs tests/crm-validation.test.mjs`.
2. Run `npm run build`, start with `npm run start -- --port 3002`, then run `node --test tests/public-blog-http.test.mjs` with database access. This test is read-only.
3. On deployment, inspect source for two different articles: title, description, canonical, article OG tags, Twitter tags, robots, dates and parseable JSON-LD. Confirm the existing image returns 200.
4. Check `/sitemap.xml` and `/robots.txt`; confirm a newly published article appears, drafts do not, and `noIndex: true` removes an article from the sitemap and emits noindex.
5. Confirm a missing article and draft URL return HTTP 404 to both a browser and crawler. Check trailing-slash redirects and every configured historical slug returns 308 to a working article.
6. Use Google's Rich Results Test and Schema Markup Validator. An article-specific representative image and explicit team author type may improve eligibility; do not invent either.
7. Submit the sitemap in Search Console and use URL Inspection to check deployed rendering, chosen canonical and indexing. Review mobile layout, social previews, PageSpeed Insights and Core Web Vitals on the deployed origin.

Technical SEO enables discovery and accurate interpretation; rankings still depend on useful content, search intent, competition, authority, links, performance and indexing. First-page rankings are not guaranteed.

Reference: [Next.js 15 Metadata API](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata).

## Changed files

- Added: `lib/blog-seo.ts`, `data/blog-redirects.json`, `tests/blog-seo.test.mjs`, `SEO-IMPLEMENTATION.md`.
- Updated: `app/blog/[slug]/page.tsx`, `app/blog/page.tsx`, `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `components/blog-card.tsx`, `lib/blog-types.ts`, `lib/crm-models.ts`, `lib/crm-validation.ts`, `next.config.mjs`, `package.json`, `package-lock.json`, `tests/public-blog-http.test.mjs`.
- Removed: `app/blog/loading.tsx`, `app/blog/[slug]/loading.tsx` to prevent premature HTTP 200 responses.

## Verification results

- Production build passed; separate TypeScript check passed.
- All 16 SEO and CRM unit tests passed; `git diff --check` passed.
- Read-only production HTTP test passed on port 3003 for all 116 published records: article HTTP 200, unique canonical per slug, expected indexability, article Open Graph metadata, matching JSON-LD, and sitemap membership.
- Missing articles returned HTTP 404 for both Googlebot and browser requests. Robots, the social image, home/service anchor and the `/blog/` permanent redirect passed.
- The database contained zero drafts, so live draft exclusion was not exercised. No records were created or modified by these tests. Noindex behavior was tested with unit fixtures; no historical redirects exist yet to exercise live.
- Deployment-side Rich Results/Search Console checks and visual/mobile performance audits remain operational checklist items, not completed validations.
