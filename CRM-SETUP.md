# Admin Blog CRM

Only active administrators can log in or use the CRM APIs. Admins manage one shared blog library using MongoDB and Mongoose: create, edit, delete, search, export, and import blogs.

Public /blog pages, article details, related articles, and the sitemap read published blogs directly from MongoDB. Drafts are private. Publishing, unpublishing, editing, or deleting a blog is reflected on the next page request without rebuilding. No mock blog data is used.

## Setup

.env.example is a template only: Next.js does not load it. Save actual values in .env.local or .env; .env.local takes precedence. Restart after changing configuration. On the first login with matching environment credentials, the admin is automatically stored in MongoDB with a hashed password. Existing accounts are not overwritten.

1. Run `npm install --legacy-peer-deps` (the existing project has React peer dependency conflicts).
2. Set `MONGODB_URI` in `.env.local` to your MongoDB Atlas or local database connection string.
3. Set `CRM_ADMIN_EMAIL`, `CRM_ADMIN_PASSWORD` (12-128 characters), and optionally `CRM_ADMIN_NAME` in `.env.local`.
4. No account creation command is required. On your first successful login with the configured credentials, the account is created automatically with a hashed password.
5. Run `npm run dev`, open `/crm/login`, and sign in. You will be redirected to `/crm/admin`.

Production requires HTTPS, a Node.js Next.js deployment, and MongoDB network access. Keep .env.local private. Session cookies are HttpOnly, SameSite=Lax, and Secure in production. Sessions expire after seven days; only token hashes are stored in MongoDB. Passwords use salted scrypt hashes. Login attempts are limited per email to ten per fifteen minutes. Mutating APIs require a matching Origin header; reverse proxies must preserve the application's request origin.

## Upload JSON

In the admin dashboard, use **Import blogs from JSON**. Choose a file or paste JSON, click **Validate and preview**, then **Import into my dashboard**. **Download example** provides a sample file. Supported inputs: a single blog, an array, or an object containing a blogs array.

Required fields: title, slug, excerpt, category, author, readingTime, publishedAt (YYYY-MM-DD), and nonempty content. Content sections accept heading, paragraphs (string array), list (string array), and quote. Optional: keywords, modifiedAt, and status (draft or published; defaults to draft). The format uses the documented blog fields; imported IDs and unknown fields are ignored.

Limits: 100 blogs and 2 MB per request. Duplicate slugs in the input or admin library are rejected. Imports do not overwrite existing blogs. Validation runs before writes. If a database failure occurs during insertion, the response reports how many blogs were saved and the dashboard refreshes; remove saved entries before retrying. Export JSON downloads your library.

MongoDB configuration and your JSON data are required before real uploads can be completed. The configured admin is created on first login; blogs are imported separately.

## Checks

`npm run test:crm` tests validation, password hashing, and schema indexes (Node.js 22.18+). With `npm run dev -- -p 3001` running, `node --test tests/crm-http.test.mjs` checks anonymous access, request origin protection, validation responses, and login redirects. Set CRM_TEST_URL for a different port. Full database integration requires a configured MongoDB instance.

Public integration check: with a development server on port 3002 and MongoDB reachable, run `node --test tests/public-blog-http.test.mjs`. This reads existing data without creating or deleting records, checking publication filtering, sitemap entries, and article availability.

## Delete all blogs

The admin library has a Delete all blogs button. Confirmation deletes every draft and published blog, including those hidden by search, and removes published articles from the website on subsequent requests. Export JSON first if a backup is needed. Admin accounts are retained. The action is disabled while loading, during a request, or when the library is empty.
