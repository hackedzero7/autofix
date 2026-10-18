import { currentUser } from "./crm-auth"
import { CrmUser } from "./crm-models"
import { connectDB } from "./mongodb"
import { MCP_SCOPES, oauthResourceMetadata, oauthServerConfig } from "./mcp-oauth-config.ts"
import { McpOAuthClient, McpOAuthCode, McpOAuthConsent, McpOAuthGrant, McpOAuthRate, McpOAuthToken } from "./mcp-oauth-models.ts"
import { OAuthError, hashToken, opaqueToken, readOAuthBody, registrationInput, requireResource, requireString, scopesFrom, singleParams, validOpaqueToken, verifyPkce } from "./mcp-oauth-validation.ts"

const HOUR = 60 * 60 * 1000
const GRANT_LIFETIME = 30 * 24 * HOUR
const responseHeaders = { "Cache-Control": "no-store", Pragma: "no-cache", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" }
export const oauthJson = (data: unknown, status = 200) => Response.json(data, { status, headers: responseHeaders })
export const oauthOptions = () => new Response(null, { status: 204, headers: responseHeaders })
export async function oauthEndpoint(action: () => Promise<Response>) {
  try { return await action() } catch (error) {
    if (error instanceof OAuthError) return oauthJson({ error: error.error, error_description: error.message }, error.status)
    console.error("MCP OAuth unavailable", error instanceof Error ? error.name : "Unknown error")
    return oauthJson({ error: "temporarily_unavailable", error_description: "The authorization service is unavailable. Check the server configuration and database connection." }, 503)
  }
}
export function authorizationMetadata() {
  const { origin, issuer } = oauthServerConfig()
  return { issuer, authorization_endpoint: `${origin}/oauth/authorize`, token_endpoint: `${origin}/oauth/token`, registration_endpoint: `${origin}/oauth/register`, revocation_endpoint: `${origin}/oauth/revoke`, scopes_supported: [...MCP_SCOPES], response_types_supported: ["code"], response_modes_supported: ["query"], grant_types_supported: ["authorization_code", "refresh_token"], token_endpoint_auth_methods_supported: ["none"], revocation_endpoint_auth_methods_supported: ["none"], code_challenge_methods_supported: ["S256"], authorization_response_iss_parameter_supported: true }
}
export { oauthResourceMetadata }

/** Atomic Mongo counters work across serverless instances and survive restarts. */
async function countRate(key: string, limit: number, periodMs: number) {
  await McpOAuthRate.init()
  const bucket = Math.floor(Date.now() / periodMs)
  const filter = { key: hashToken(`${key}:${bucket}`) }
  let record
  try {
    record = await McpOAuthRate.findOneAndUpdate(filter, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * periodMs) } }, { upsert: true, new: true })
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error
    record = await McpOAuthRate.findOneAndUpdate(filter, { $inc: { count: 1 } }, { new: true })
  }
  if (!record || record.count > limit) throw new OAuthError("temporarily_unavailable", "Too many requests. Try again later.", 429)
}
async function rate(request: Request, kind: string, limit: number, periodMs: number) {
  // Vercel supplies x-forwarded-for. The global ceiling also bounds spoofed IPs on other hosts.
  const ip = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim().slice(0, 128)
  await countRate(`${kind}:global`, limit * 50, periodMs)
  await countRate(`${kind}:ip:${ip}`, limit, periodMs)
}
async function registeredClient(id: unknown) {
  const clientId = requireString(id, "client_id", 100)
  if (!validOpaqueToken(clientId, "client")) throw new OAuthError("invalid_client", "Unknown or disabled client.", 401)
  const client = await McpOAuthClient.findOne({ clientId, active: true })
  if (!client) throw new OAuthError("invalid_client", "Unknown or disabled client.", 401)
  return client
}
export async function registerClient(request: Request) {
  oauthServerConfig()
  const input = registrationInput(await readOAuthBody(request, "json"))
  await connectDB()
  await rate(request, "register", 20, HOUR)
  const clientId = opaqueToken("client")
  await McpOAuthClient.create({ clientId, ...input })
  return oauthJson({ client_id: clientId, client_id_issued_at: Math.floor(Date.now() / 1000), client_name: input.name, redirect_uris: input.redirectUris, scope: input.scopes.join(" "), grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], token_endpoint_auth_method: "none" }, 201)
}
const htmlEscape = (value: unknown) => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!))
function authorizationRedirect(redirectUri: string, values: Record<string, string | undefined>) {
  const target = new URL(redirectUri)
  for (const [key, value] of Object.entries({ ...values, iss: oauthServerConfig().issuer })) if (value !== undefined) target.searchParams.set(key, value)
  return new Response(null, { status: 303, headers: { Location: target.toString(), "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } })
}
export async function authorizeGet(request: Request) {
  const config = oauthServerConfig()
  if (request.url.length > 10000) throw new OAuthError("invalid_request", "Authorization URL is too long.")
  const params = singleParams(new URL(request.url).searchParams)
  if (params.response_type !== "code") throw new OAuthError("unsupported_response_type", "Use the authorization code flow.")
  requireResource(params.resource, config.resource)
  if (params.code_challenge_method !== "S256" || !/^[A-Za-z0-9_-]{43}$/.test(params.code_challenge || "")) throw new OAuthError("invalid_request", "PKCE with S256 is required.")
  if (params.state && params.state.length > 2048) throw new OAuthError("invalid_request", "state is too long.")
  await connectDB()
  await rate(request, "authorize", 60, 60 * 1000)
  const client = await registeredClient(params.client_id)
  if (!client.redirectUris.includes(params.redirect_uri)) throw new OAuthError("invalid_request", "redirect_uri must exactly match a registered client redirect URI.")
  const scopes = scopesFrom(params.scope, client.scopes)
  const user = await currentUser()
  if (!user) {
    const login = new URL("/crm/login", config.origin)
    login.searchParams.set("returnTo", `/oauth/authorize?${new URL(request.url).searchParams.toString()}`)
    return new Response(null, { status: 303, headers: { Location: login.toString(), "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } })
  }
  await countRate(`consent:${user.id}`, 60, 60 * 1000)
  const token = opaqueToken("consent"), csrf = opaqueToken("csrf")
  await McpOAuthConsent.create({ tokenHash: hashToken(token), csrfHash: hashToken(csrf), userId: user.id, clientId: client.clientId, redirectUri: params.redirect_uri, scopes, resource: config.resource, codeChallenge: params.code_challenge, state: params.state, expiresAt: new Date(Date.now() + 10 * 60 * 1000) })
  const labels: Record<string, string> = { "blogs:read": "Read and validate articles, including drafts", "blogs:write": "Create, edit, and publish articles", "blogs:delete": "Permanently delete individual articles" }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connect to Pro Auto Care</title><style>body{font:16px system-ui,sans-serif;background:#f4f6f8;color:#192533;margin:0;padding:32px 16px}main{max-width:600px;margin:40px auto;background:white;border:1px solid #d4dae1;border-radius:14px;padding:28px}h1{font-size:26px}li{margin:14px 0}p{line-height:1.6;overflow-wrap:anywhere}.muted{color:#526170}button{font:inherit;padding:12px 18px;border-radius:7px;border:1px solid #9aa8b8;cursor:pointer;margin:8px 8px 0 0}.approve{background:#173d75;color:white;border-color:#173d75}</style></head><body><main><h1>Connect to Pro Auto Care</h1><p><strong>${htmlEscape(client.name)}</strong> requests access to your blog library as ${htmlEscape(user.email)}.</p><p class="muted">Client names are supplied by the requesting app. Approve only an app you recognize.</p><ul>${scopes.map(scope => `<li>${labels[scope]}</li>`).join("")}</ul><p class="muted">The app receives revocable tokens, and never receives your administrator password. Access can continue for up to 30 days. Manage or revoke access from <a href="${htmlEscape(config.origin)}/crm/connections">Connected apps</a>. Return address: ${htmlEscape(params.redirect_uri)}</p><form method="post" action="${htmlEscape(config.origin)}/oauth/authorize"><input type="hidden" name="consent_token" value="${token}"><input type="hidden" name="csrf" value="${csrf}"><button class="approve" type="submit" name="decision" value="approve">Approve access</button><button type="submit" name="decision" value="deny">Cancel</button></form></main></body></html>`
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Frame-Options": "DENY", "Content-Security-Policy": `default-src 'none'; style-src 'unsafe-inline'; form-action ${config.origin}; frame-ancestors 'none'; base-uri 'none'` } })
}
export async function authorizePost(request: Request) {
  const config = oauthServerConfig()
  const params = await readOAuthBody(request, "form")
  const token = requireString(params.consent_token, "consent_token", 100), csrf = requireString(params.csrf, "csrf", 100)
  if (!validOpaqueToken(token, "consent") || !validOpaqueToken(csrf, "csrf") || !["approve", "deny"].includes(String(params.decision))) throw new OAuthError("invalid_request", "Invalid consent response.")
  const user = await currentUser()
  if (!user) throw new OAuthError("access_denied", "Sign in again and reconnect the app.", 401)
  const pending = await McpOAuthConsent.findOneAndDelete({ tokenHash: hashToken(token), csrfHash: hashToken(csrf), userId: user.id, expiresAt: { $gt: new Date() } })
  if (!pending) throw new OAuthError("invalid_request", "This consent request has expired or was already used. Reconnect the app.")
  const client = await registeredClient(pending.clientId)
  if (!client.redirectUris.includes(pending.redirectUri) || pending.resource !== config.resource || pending.scopes.some((scope: string) => !client.scopes.includes(scope))) throw new OAuthError("invalid_request", "The client configuration changed. Reconnect the app.")
  if (params.decision === "deny") return authorizationRedirect(pending.redirectUri, { error: "access_denied", state: pending.state })
  const grant = await McpOAuthGrant.create({ userId: user.id, clientId: pending.clientId, resource: config.resource, scopes: pending.scopes, expiresAt: new Date(Date.now() + GRANT_LIFETIME) })
  const code = opaqueToken("code")
  await McpOAuthCode.create({ tokenHash: hashToken(code), grantId: grant._id, clientId: pending.clientId, redirectUri: pending.redirectUri, resource: config.resource, codeChallenge: pending.codeChallenge, expiresAt: new Date(Date.now() + 5 * 60 * 1000) })
  return authorizationRedirect(pending.redirectUri, { code, state: pending.state })
}
async function validGrant(grantId: unknown, clientId: string, resource: string) {
  const grant = await McpOAuthGrant.findOne({ _id: grantId, clientId, resource, revokedAt: null, expiresAt: { $gt: new Date() } })
  if (!grant || !await CrmUser.exists({ _id: grant.userId, active: true, role: "admin" })) throw new OAuthError("invalid_grant", "The authorization has expired or has been revoked.")
  return grant
}
async function issueTokens(grant: any, scopes: string[]) {
  const accessToken = opaqueToken("access"), refreshToken = opaqueToken("refresh")
  const now = Date.now(), expiry = new Date(Math.min(now + HOUR, grant.expiresAt.getTime()))
  // Store only hashes. The refresh chain shares an absolute 30-day grant expiry.
  await McpOAuthToken.insertMany([
    { tokenHash: hashToken(accessToken), type: "access", grantId: grant._id, clientId: grant.clientId, scopes, expiresAt: expiry },
    { tokenHash: hashToken(refreshToken), type: "refresh", grantId: grant._id, clientId: grant.clientId, scopes, expiresAt: grant.expiresAt },
  ])
  return oauthJson({ access_token: accessToken, token_type: "Bearer", expires_in: Math.max(0, Math.floor((expiry.getTime() - now) / 1000)), refresh_token: refreshToken, scope: scopes.join(" ") })
}
export async function exchangeToken(request: Request) {
  const config = oauthServerConfig()
  if (request.headers.has("authorization")) throw new OAuthError("invalid_client", "Use the registered public client_id in the request body; client authentication is none.", 401)
  const params = await readOAuthBody(request, "form")
  requireResource(params.resource, config.resource)
  await connectDB()
  await rate(request, "token", 120, 60 * 1000)
  const client = await registeredClient(params.client_id)
  await countRate(`token:client:${client.clientId}`, 120, 60 * 1000)
  if (params.grant_type === "authorization_code") {
    const code = requireString(params.code, "code", 100), verifier = requireString(params.code_verifier, "code_verifier", 128)
    if (!validOpaqueToken(code, "code")) throw new OAuthError("invalid_grant", "Invalid authorization code.")
    const filter = { tokenHash: hashToken(code), clientId: client.clientId, redirectUri: params.redirect_uri, resource: config.resource, expiresAt: { $gt: new Date() } }
    const record = await McpOAuthCode.findOne(filter)
    if (!record || !verifyPkce(verifier, record.codeChallenge) || !client.redirectUris.includes(params.redirect_uri)) throw new OAuthError("invalid_grant", "Invalid authorization code, redirect URI, or PKCE verifier.")
    if (record.consumedAt) {
      await McpOAuthGrant.updateOne({ _id: record.grantId }, { $set: { revokedAt: new Date() } })
      throw new OAuthError("invalid_grant", "The authorization code has already been used. Reconnect the app.")
    }
    const grant = await validGrant(record.grantId, client.clientId, config.resource)
    if (!await McpOAuthCode.findOneAndUpdate({ ...filter, consumedAt: null }, { $set: { consumedAt: new Date() } })) {
      await McpOAuthGrant.updateOne({ _id: record.grantId }, { $set: { revokedAt: new Date() } })
      throw new OAuthError("invalid_grant", "The authorization code has already been used. Reconnect the app.")
    }
    return issueTokens(grant, grant.scopes)
  }
  if (params.grant_type === "refresh_token") {
    const token = requireString(params.refresh_token, "refresh_token", 100)
    if (!validOpaqueToken(token, "refresh")) throw new OAuthError("invalid_grant", "Invalid refresh token.")
    const filter = { tokenHash: hashToken(token), type: "refresh", clientId: client.clientId, expiresAt: { $gt: new Date() } }
    const record = await McpOAuthToken.findOne(filter)
    if (!record) throw new OAuthError("invalid_grant", "Invalid or expired refresh token.")
    if (record.consumedAt) {
      await McpOAuthGrant.updateOne({ _id: record.grantId }, { $set: { revokedAt: new Date() } })
      throw new OAuthError("invalid_grant", "Refresh token reuse detected. Reconnect the app.")
    }
    const grant = await validGrant(record.grantId, client.clientId, config.resource)
    const scopes = scopesFrom(params.scope as string | undefined, record.scopes)
    if (!await McpOAuthToken.findOneAndUpdate({ ...filter, consumedAt: null }, { $set: { consumedAt: new Date() } })) {
      await McpOAuthGrant.updateOne({ _id: record.grantId }, { $set: { revokedAt: new Date() } })
      throw new OAuthError("invalid_grant", "Refresh token reuse detected. Reconnect the app.")
    }
    return issueTokens(grant, scopes)
  }
  throw new OAuthError("unsupported_grant_type", "Use authorization_code or refresh_token.")
}
export async function revokeToken(request: Request) {
  oauthServerConfig()
  if (request.headers.has("authorization")) throw new OAuthError("invalid_client", "Use client_id in the form body.", 401)
  const params = await readOAuthBody(request, "form")
  const token = requireString(params.token, "token", 100)
  await connectDB()
  await rate(request, "revoke", 120, 60 * 1000)
  const client = await registeredClient(params.client_id)
  if (validOpaqueToken(token, "access") || validOpaqueToken(token, "refresh")) {
    const record = await McpOAuthToken.findOne({ tokenHash: hashToken(token), clientId: client.clientId })
    if (record) await McpOAuthGrant.updateOne({ _id: record.grantId, clientId: client.clientId }, { $set: { revokedAt: new Date() } })
  }
  // RFC 7009: unknown/already-revoked tokens receive the same success response.
  return new Response(null, { status: 200, headers: responseHeaders })
}
