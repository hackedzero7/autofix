# Pro Auto Care blog MCP

This project exposes the existing MongoDB blog library to remote AI agents at **`https://YOUR_DOMAIN/mcp`**. Deploy the same Next.js application; a separate MCP service is not required. The agent can read, validate, create, update, publish, unpublish, and delete articles using an administrator's explicitly authorized permissions.

The code is prepared for deployment. A live Vercel deployment, production OAuth connection, and recurring article job must still be configured and verified in your accounts. This guide does not mean those external steps have already happened.

## What is included

| Capability | MCP interface | Permission |
| --- | --- | --- |
| Search/list articles, including private drafts | `blogs_list` | `blogs:read` |
| Read an article and its current version | `blogs_get` | `blogs:read` |
| Check a proposed article without saving | `blogs_validate` | `blogs:read` |
| Create an article; draft by default | `blogs_create` | `blogs:write` |
| Edit, publish, or unpublish an article | `blogs_update` | `blogs:write` |
| Delete one article with its slug and current version | `blogs_delete` | `blogs:delete` |
| Discover the exact schema/content requirements | Resources `blog://schema`, `blog://writing-guide` | `blogs:read` |
| Obtain a two-article weekly workflow | Prompt `weekly_articles` | `blogs:read` |

Updates and deletions use `expectedUpdatedAt` from the latest read. If another editor changed the article, read it again and review the changes before retrying. A delete additionally requires `confirmationSlug` matching the target slug. Tool annotations help hosts show confirmations; the host decides its approval interface.

`blogs_list` accepts `search`, `status` (`draft` or `published`), `page`, and `limit` (maximum 50). `blogs_get` uses `slug`. `blogs_create` and `blogs_validate` accept a `post` object; `blogs_update` accepts `slug`, `expectedUpdatedAt`, and partial `changes`. Article JSON is limited to 256 KiB in UTF-8. The schema resource exposes field-level limits. Creating an already-existing slug returns `created: false` and the existing article without overwriting it; inspect that result before counting a weekly run as complete.

The website's current blog format is **text content in structured sections**. There is no article image field, binary/blob upload tool, attachment storage, or generated-image service in this integration. A blog post and a storage blob are different things. Images require a separate media-storage/schema/frontend feature before agents can upload and display them.

## Article content and SEO

Required post fields are `title`, `slug`, `excerpt`, `category`, `author`, `readingTime`, `publishedAt`, and a nonempty `content` array. Optional fields are `keywords`, `modifiedAt`, `status`, `metaTitle`, `metaDescription`, `noIndex`, and `authorType` (`Person` or `Organization`). `status` defaults to `draft`; keywords default to an empty array. Updates stamp `modifiedAt` using the server's current UTC date.

Each content section can contain a `heading`, `paragraphs` (array of plain text), `list` (array of plain text), and/or `quote`. Supply useful paragraphs and lists under the relevant headings; HTML strings, Markdown documents, image URLs, and attachment objects are not this website's article format. This is a valid-shaped example for validation, with placeholder copy that must be replaced before publication:

```json
{
  "title": "Replace with the approved article title",
  "slug": "replace-with-approved-unique-slug",
  "excerpt": "Replace with a concise, accurate summary of the finished article.",
  "category": "Vehicle Maintenance",
  "author": "Pro Auto Care",
  "authorType": "Organization",
  "readingTime": "5 min read",
  "publishedAt": "2026-10-19",
  "keywords": ["replace with the main topic"],
  "metaTitle": "Replace with an accurate search title",
  "metaDescription": "Replace with an accurate description that matches the article.",
  "status": "draft",
  "content": [
    {
      "heading": "Replace with a useful section heading",
      "paragraphs": ["Replace with original, fact-checked article text."],
      "list": ["Replace with one practical, supported recommendation."]
    }
  ]
}
```

The MCP argument wraps that object as `{ "post": { ... } }`. Use the actual article date and a reading time based on the completed text. Keep excerpts, metadata, categories, and keywords consistent with the content. The existing site generates canonical URLs, Open Graph/Twitter metadata, `BlogPosting` structured data, and sitemap entries from these fields. It uses the shared site social image; this integration does not add per-article cover images. `noIndex: true` prevents indexing metadata and excludes the post from the sitemap; it is not a privacy control. Keep private articles as drafts.

## Administrator sign-in and consent

1. The connector discovers this server's OAuth metadata and registers a public OAuth client.
2. A browser opens this website. The administrator signs in at `/crm/login` using the existing CRM account.
3. The consent screen identifies the client and requests specific permissions. Approve only the scopes needed for that connection.
4. The connector exchanges its authorization code using PKCE `S256`, then sends an OAuth bearer access token to `/mcp`.
5. Every MCP request verifies the token and checks that its administrator remains active. Each tool also checks its required scope.

The CRM password stays in the website's login flow. Never paste it into an agent prompt, connector headers, source code, or tool arguments. All active administrators currently manage the same shared blog library; these are not separate per-admin libraries.

Access tokens last **one hour**. Refresh tokens rotate after use and the original authorization expires after **30 days**; reconnect after that. A reused refresh token invalidates the authorization family. Tokens and authorization codes are stored as hashes in MongoDB. No static MCP API key is supplied by this implementation.

The routes are:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/mcp` | Authenticated MCP Streamable HTTP requests |
| `GET` | `/.well-known/oauth-protected-resource` | Resource discovery; resource is the full `/mcp` URL |
| `GET` | `/.well-known/oauth-protected-resource/mcp` | Path-specific resource discovery |
| `GET` | `/.well-known/oauth-authorization-server` | Authorization server discovery |
| `POST` | `/oauth/register` | Dynamic registration of a public OAuth client |
| `GET`, `POST` | `/oauth/authorize` | Administrator login and explicit consent |
| `POST` | `/oauth/token` | Authorization code exchange or rotating refresh |
| `POST` | `/oauth/revoke` | Revoke the authorization associated with a token |

Registration uses `token_endpoint_auth_method: "none"`, so there is **no OAuth client secret**. Redirect URIs must match the registered URI exactly; production callbacks use HTTPS. Authorization and token requests must include `resource=https://YOUR_DOMAIN/mcp`. Let the connector handle registration, state, PKCE, and token storage. The implementation supports dynamic client registration (DCR); if a host offers published client identity/CIMD or automatic registration, select **automatic registration / DCR** for this server. These discovery and PKCE requirements follow the [official OpenAI authentication documentation](https://developers.openai.com/plugins/build/auth).

## Configure locally

Use Node.js 22.18 or newer for the repository's TypeScript-aware Node tests. Install dependencies using the existing project's React peer-dependency workaround:

```powershell
npm.cmd install --legacy-peer-deps
```

Create a private `.env.local` using `.env.example` as the template. Next.js does not load `.env.example`. Use your own values:

```dotenv
MONGODB_URI="mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER/YOUR_DATABASE"
CRM_ADMIN_EMAIL="admin@example.com"
CRM_ADMIN_PASSWORD="REPLACE_WITH_A_UNIQUE_PASSWORD_AT_LEAST_12_CHARACTERS"
CRM_ADMIN_NAME="Pro Auto Care Admin"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
MCP_SERVER_URL="http://localhost:3000/mcp"
```

`MCP_SERVER_URL` is the canonical MCP address. It can accept the origin or the complete endpoint; use the complete `/mcp` URL for clarity. `NEXT_PUBLIC_SITE_URL` is the public website origin **without a path** and controls article canonical URLs, social metadata, and the sitemap. Restart Next.js after changing environment variables.

`MCP_ALLOWED_ORIGINS` is optional: a comma-separated list of additional browser origins, for example `http://localhost:6274,http://127.0.0.1:6274` when a local browser client needs them. Browser requests with an `Origin` must match the canonical server origin or that configured list; server-to-server requests without `Origin` are allowed. OAuth callback URIs and browser `Origin` values are separate settings; do not copy callback paths into this variable.

```powershell
npm.cmd run dev
```

Visit `http://localhost:3000/crm/login` and sign in. A matching configured environment administrator is created automatically on first successful login if that account does not already exist. Existing database accounts are not overwritten by changing bootstrap credentials. See [CRM-SETUP.md](./CRM-SETUP.md) for CRM behavior.

Localhost works for a local MCP Inspector. Hosted AI clients need a reachable HTTPS deployment or a development forwarding service; their servers cannot reach your machine's localhost.

## Deploy on Vercel

Vercel supports Next.js MCP endpoints over Streamable HTTP. This repository uses the MCP TypeScript SDK directly and does not need Redis for MCP sessions. OAuth data and blog records persist in MongoDB rather than process memory. See [Vercel's MCP hosting documentation](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel).

1. Import this repository into Vercel as a **Next.js** project. Keep the repository root as the project root and use a supported Node.js runtime (Node 22 is suitable).
2. Set Install Command to `npm install --legacy-peer-deps` and Build Command to `npm run build`. Keep the Next.js output directory default.
3. Choose your stable production domain, for example `https://www.proautocare.co`. Use the domain that actually serves this deployment.
4. In Project Settings → Environment Variables, add `MONGODB_URI`, `CRM_ADMIN_EMAIL`, `CRM_ADMIN_PASSWORD`, and optionally `CRM_ADMIN_NAME` using production values. Set `NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN` and `MCP_SERVER_URL=https://YOUR_DOMAIN/mcp`.
5. Allow the Vercel runtime to reach MongoDB Atlas. Atlas checks the connecting server's network address, so allowlisting your laptop is insufficient. Use an Atlas network configuration that covers the deployment's outbound addresses. If fixed allowlisted egress is required, configure Vercel's appropriate static/private networking capability, then allowlist those addresses. See [Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/) and [Vercel deployment IP guidance](https://vercel.com/kb/guide/how-to-allowlist-deployment-ip-address).
6. Deploy, then open the production CRM login and authenticate with the real account. Check production function logs if database access fails.
7. Run the discovery and Inspector checks below against the production domain before connecting an agent or enabling a recurring job.

Environment changes apply to subsequent deployments; **redeploy after adding or changing them**. Give Preview deployments their own test database and a canonical MCP URL matching that preview if you test OAuth there. A connection authorized for a different hostname is not interchangeable. See [Vercel environment variables](https://vercel.com/docs/environment-variables).

The MCP, discovery, OAuth routes, and browser login must be reachable by the connecting host. A Vercel authentication/password wall or WAF challenge in front of these routes prevents discovery before this application's OAuth can run; verify production protection settings for this integration. Keep application OAuth enabled. See [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments).

Use a Node.js server deployment. Uploading an `out` folder to static hosting or enabling `output: "export"` cannot run OAuth, sessions, MongoDB writes, or the MCP POST endpoint. See [Next.js static export limitations](https://nextjs.org/docs/app/guides/static-exports).

## Check discovery and the connection

Run the local checks before deploying:

```powershell
npm.cmd run test:mcp
npm.cmd run test:crm
npm.cmd run typecheck
npm.cmd run build
```

The MCP tests use injected article repositories and mocked OAuth database operations; they do not write to your live database. They include a real SDK client/transport round trip. Live MongoDB access, browser consent with a real host, and production token refresh still need verification after deployment. The existing Google Fonts configuration requires network access during the build.

These commands read metadata or make an unauthenticated request. They do not create, update, or delete articles. In PowerShell:

```powershell
$mcpOrigin = 'https://YOUR_DOMAIN'
Invoke-RestMethod "$mcpOrigin/.well-known/oauth-authorization-server"
Invoke-RestMethod "$mcpOrigin/.well-known/oauth-protected-resource"
curl.exe -i -X POST "$mcpOrigin/mcp" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' --data '{}'
```

Expected: metadata is JSON, its resource is `https://YOUR_DOMAIN/mcp`, issuer/endpoint URLs use the same canonical deployment, and the unauthenticated MCP request returns `401` with a `WWW-Authenticate` resource metadata challenge. HTML, a Vercel login page, a redirect loop, `404`, or a different hostname indicates a routing/configuration issue.

Start the official Inspector:

```powershell
npx.cmd @modelcontextprotocol/inspector@latest
```

Open the URL printed by Inspector and use its printed proxy/session token. Select **Streamable HTTP**, enter the full `/mcp` URL, and complete OAuth with automatic registration and CRM browser consent. Add the Inspector's browser origin to `MCP_ALLOWED_ORIGINS` only if the browser is making requests directly and the server reports an Origin error. Inspector usage is covered in [Vercel's official MCP guide](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel).

For a read-only check, grant `blogs:read`, list tools/resources/prompts, read `blog://schema`, and call `blogs_list`. If the library has an existing article, call `blogs_get` for its slug. `blogs_validate` can check a proposed article without saving. Verify that a write call is rejected when only read permission is granted. Exercise real create/update/delete only in a dedicated test database or with a specifically approved disposable test article.

After connecting a real host, verify its read tools first. Draft creation, publication, updating, deletion, and refresh must be exercised deliberately before relying on unattended writes. A successful `next build` alone does not establish live Atlas, OAuth-client, or hosting connectivity.

## Connect ChatGPT

The current **official OpenAI documentation** uses ChatGPT **Plugins → plus → Add custom MCP server**. Enter the full `https://YOUR_DOMAIN/mcp` URL, choose OAuth/automatic registration when prompted, complete CRM login and consent, then create/install the resulting plugin. Start a conversation with it enabled and test a read. Account eligibility and workspace policies control availability; an absent creation option needs the appropriate account/workspace access. Write actions can require host approval. Refresh the connection's metadata after changing server tools. See [Connect and test your plugin](https://developers.openai.com/plugins/deploy/connect-chatgpt) and [MCP in ChatGPT and Codex](https://learn.chatgpt.com/docs/extend/mcp).

For a custom OpenAI API application, use the remote MCP `server_url` with an OAuth access token in `authorization`. Your application is responsible for acquiring, securely storing, refreshing, and revoking that token and handling required tool approvals. This is separate from installing a ChatGPT plugin. See [OpenAI remote MCP tools](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

## Connect Claude

In Claude, open **Customize → Connectors → Add custom connector**, enter a descriptive name and `https://YOUR_DOMAIN/mcp`, and review OAuth authentication. Select **Register automatically** for the OAuth client, then sign in to this website and approve scopes. Enable the connector for the conversation. Organization owners may need to add it first under organization connector settings. Claude's remote connector calls originate from Anthropic's servers, so the deployment must be publicly reachable. Availability and UI depend on the account. See [Anthropic's custom connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

## Connect Grok or another agent host

The current xAI documentation describes **grok.com/connectors → New Connector → Custom**. Supply `https://YOUR_DOMAIN/mcp` and complete its authentication. If OAuth client selection is offered, use automatic registration/DCR. Team administration and account availability can affect what is shown. See [xAI's connector documentation](https://docs.x.ai/grok/connectors).

An xAI API workflow can also configure a remote MCP `server_url` and OAuth bearer `authorization`, with `allowed_tools` limiting the exposed tools. The caller must handle this server's OAuth/token lifecycle; the API configuration does not perform CRM browser consent for you. See [xAI remote MCP tools](https://docs.x.ai/developers/tools/remote-mcp).

For any other dashboard/agent platform, verify that the exact product supports **remote MCP Streamable HTTP**, **OAuth authorization code with PKCE**, **dynamic client registration**, **refresh-token rotation**, and the required **write tools**. A platform that only accepts local stdio or legacy SSE cannot connect directly to this endpoint. The product name spoken as “brain dropboard” is not specific enough to verify a particular integration; use the platform's exact name and documentation for that final configuration.

## Schedule two articles each week

**MCP provides tools; it does not run a clock or create articles automatically.** This repository does not add a recurring AI job or an AI-provider API key. Choose an agent platform that can schedule jobs and invoke authenticated MCP write tools, or build a scheduled API worker that performs that role. Confirm the chosen host actually supports scheduled connector/tool use; a normal ChatGPT reminder/task should not be assumed to invoke custom MCP tools.

A weekly job needs the connector enabled, `blogs:read blogs:write` authorization, secure token persistence, automatic refresh-token rotation, and an alert when reconnection is needed after the 30-day authorization expiry. It does not need `blogs:delete`. The job also needs access to approved research sources if its articles depend on current information. Keep a run log and record the two returned article IDs/slugs before marking a week complete.

Example schedule: **every Monday at 09:00 Asia/Karachi**, creating two drafts in one run. Set the timezone explicitly in the scheduler. If a scheduler expects UTC cron, that example is `0 4 * * 1` because Karachi is UTC+05:00. A scheduler trigger alone is insufficient unless an agent/API worker is configured to do the research and MCP calls.

The server exposes a `weekly_articles` prompt with `weekStart` (`YYYY-MM-DD`), optional `topics` and `author`, and `publish` (`draft` or `published`). Use `draft` until the administrator has explicitly authorized automatic publication. The following prompt can also be pasted into the chosen recurring agent task:

```text
Run the Pro Auto Care weekly article workflow for the week starting [YYYY-MM-DD].
Create exactly two new, distinct articles in English for the website's audience.
Use the connected Pro Auto Care MCP server.

Read blog://schema and blog://writing-guide first. List/search existing drafts
and published articles, paging through results as needed, so neither the topic
nor slug duplicates existing work. Use a stable week identifier in your run log;
on a retry, check the prior result before creating anything else.

Use the business facts and topics approved by the administrator. Research
time-sensitive claims from reliable sources available to you. Do not invent
prices, qualifications, warranties, service locations, statistics, quotes,
customer stories, or manufacturer guidance. If a necessary fact cannot be
verified, omit it or stop and report what is missing.

For each article provide title, a unique lowercase hyphenated slug, excerpt,
category, approved author, honest readingTime, publishedAt in YYYY-MM-DD,
focused keywords, and useful original content in the required section array.
Use heading, paragraphs, list, and quote only where appropriate. Plain text
fields must contain plain text; do not put raw HTML or Markdown syntax into
paragraphs. Give practical, accurate vehicle-care guidance; urgent safety
symptoms should direct readers to a qualified workshop.

Add an accurate metaTitle and metaDescription where useful. Use the approved
authorType, and do not claim a person reviewed the article unless they did.
The site generates canonical URLs, article schema, and the sitemap. Do not
put JSON-LD or custom canonical tags into article paragraphs. Do not upload
images/blobs because this server does not expose media storage.

Call blogs_validate for each proposed post and resolve validation errors.
Create each with blogs_create and status "draft". Publish only if this task
has separately been granted explicit automatic-publication authorization.
Do not edit or delete other articles during this weekly job.

Read the two saved articles back to verify their fields/status. Report their
slugs, IDs, status, and any research limitations. Drafts are reviewed in the
CRM; published articles are available at /blog/SLUG. If a call fails after a
possible write, look up its slug before retrying to avoid duplicate work.
```

`publishedAt` is article metadata, not a future-publication timer. A record with `status: "published"` becomes public on the next website request even if its date is in the future. Schedule the publish action itself if timed release is required.

## Edit, publish, and delete safely

Read a post with `blogs_get`, keep the exact returned `updatedAt`, then call `blogs_update` with `slug`, `expectedUpdatedAt`, and only the intended `changes`. Setting `changes.status` to `published` publishes; setting it to `draft` unpublishes. The current version check prevents overwriting another editor's intervening changes. A publication should be checked in `/crm/admin`, `/blog/SLUG`, and the sitemap; no rebuild is needed for database-backed article changes.

For deletion, use `blogs_delete` with the exact slug, latest `expectedUpdatedAt`, and the same slug as `confirmationSlug`. This removes the database article and its public page. Export a backup from the CRM first when retention is needed. The MCP server intentionally exposes single-article deletion, rather than an unattended delete-all workflow.

Administrators can open **`/crm/connections`** to review their own active AI connections, approved permissions, callback origins, authorization date, and expiry. Select **Revoke access** and confirm to block that authorization's access and refresh tokens on subsequent requests. It does not delete articles or remove other administrators' connections. Scheduled jobs using the revoked authorization must reconnect and obtain fresh consent. Authorizations expire after 30 days even when refreshed; the expiry shown on this page is the deadline for reconnecting.

To revoke a connection programmatically, its OAuth client submits a form-encoded POST to `/oauth/revoke` with `client_id` and a token (`token_type_hint` optional). It revokes that authorization family. A client should revoke before forgetting its tokens. Removing a plugin/connector from a host may only remove the local connection; use the website's connections page when server-side revocation is needed. Deactivating an administrator also blocks their MCP credentials on subsequent requests.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Connector cannot discover tools | Full `/mcp` URL, Streamable HTTP, public HTTPS, valid metadata, no hosting login/challenge |
| `401` without a token | Expected; complete OAuth. A CRM cookie is not an MCP bearer token |
| `403` / insufficient scope | Reconnect/consent with the required `blogs:*` permission; changing prompts cannot grant it |
| Consent/login loops | Canonical hostname, `MCP_SERVER_URL`, HTTPS cookies, redirects and browser session |
| OAuth invalid redirect/resource | Use the exact registered callback and the full canonical `/mcp` resource at authorization and token exchange |
| Browser Origin rejected | Add only the actual browser origin to `MCP_ALLOWED_ORIGINS`, then redeploy/restart |
| Refresh rejected | Save the newly rotated refresh token after every refresh; reconnect on expiry or token reuse |
| MongoDB timeout | Production URI, database credentials, Atlas cluster status/DNS/TLS, runtime outbound network access |
| Stale article version | Read the post again, review intervening changes, retry with the latest `updatedAt` |
| Duplicate slug | Read the existing article; do not silently change slugs or create another article on retries |
| Draft missing from public blog | Expected; review it in CRM and explicitly publish it |
| Weekly run never happens | Configure the scheduler/agent job; connecting MCP does not schedule work |

Do not expose database URIs, passwords, access tokens, refresh tokens, authorization codes, or connector request headers in shared screenshots/logs. If real credentials were shared through an old environment template or committed source, rotate them in the provider and update private deployment settings.
