import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { MCP_SCOPES } from "./mcp-oauth-config.ts"

export class OAuthError extends Error {
  error: string
  status: number
  constructor(error: string, message: string, status = 400) { super(message); this.error = error; this.status = status }
}
export const hashToken = (value: string) => createHash("sha256").update(value).digest("hex")
export const opaqueToken = (kind: string) => `mcp_${kind}_${randomBytes(32).toString("base64url")}`
export const validOpaqueToken = (value: string, kind: string) => new RegExp(`^mcp_${kind}_[A-Za-z0-9_-]{43}$`).test(value)
export function constantEquals(left: string, right: string) {
  const a = Buffer.from(left), b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}
export function verifyPkce(verifier: string, challenge: string) {
  return /^[A-Za-z0-9._~-]{43,128}$/.test(verifier) && constantEquals(createHash("sha256").update(verifier).digest("base64url"), challenge)
}
export function scopesFrom(value: string | undefined, allowed: readonly string[] = MCP_SCOPES) {
  const scopes = value === undefined ? [...allowed] : value.split(" ").filter(Boolean)
  if (!scopes.length || scopes.length > 3 || scopes.some(scope => !allowed.includes(scope))) throw new OAuthError("invalid_scope", "Request only blogs:read, blogs:write, or blogs:delete permissions.")
  return [...new Set(scopes)]
}
export function redirectUri(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) throw new OAuthError("invalid_redirect_uri", "A valid redirect_uri is required.")
  let url: URL
  try { url = new URL(value) } catch { throw new OAuthError("invalid_redirect_uri", "redirect_uri must be an absolute URL.") }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  if ((url.protocol !== "https:" && !(url.protocol === "http:" && local)) || url.username || url.password || value.includes("#") || value.includes("*")) throw new OAuthError("invalid_redirect_uri", "Use HTTPS, or HTTP loopback for a local client, without credentials, fragments, or wildcards.")
  return value
}
export function singleParams(params: URLSearchParams) {
  const result: Record<string, string> = {}
  for (const [key, value] of params) {
    if (Object.hasOwn(result, key)) throw new OAuthError("invalid_request", `Duplicate ${key} parameter.`)
    if (key.length > 100 || value.length > 4096) throw new OAuthError("invalid_request", "OAuth parameter is too long.")
    Object.defineProperty(result, key, { value, enumerable: true })
  }
  return result
}
export function requireResource(value: unknown, resource: string) {
  if (value !== resource) throw new OAuthError("invalid_target", "The resource must be this server's canonical /mcp URL.")
}
export function requireString(value: unknown, name: string, max = 2048) {
  if (typeof value !== "string" || !value || value.length > max) throw new OAuthError("invalid_request", `${name} is required and must be no longer than ${max} characters.`)
  return value
}
export async function readOAuthBody(request: Request, format: "json" | "form", maxBytes = 16384) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()
  if (contentType !== (format === "json" ? "application/json" : "application/x-www-form-urlencoded")) throw new OAuthError("invalid_request", `Use ${format === "json" ? "application/json" : "application/x-www-form-urlencoded"}.`, 415)
  const reader = request.body?.getReader()
  if (!reader) throw new OAuthError("invalid_request", "A request body is required.")
  const parts: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) { await reader.cancel(); throw new OAuthError("invalid_request", "OAuth body is too large.", 413) }
    parts.push(value)
  }
  const raw = Buffer.concat(parts).toString("utf8")
  if (format === "form") return singleParams(new URLSearchParams(raw))
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error()
    return parsed as Record<string, unknown>
  } catch { throw new OAuthError("invalid_request", "A JSON object is required.") }
}
export function registrationInput(input: Record<string, unknown>) {
  if (!Array.isArray(input.redirect_uris) || input.redirect_uris.length < 1 || input.redirect_uris.length > 5) throw new OAuthError("invalid_client_metadata", "Register between one and five exact redirect_uris.")
  const redirects = [...new Set(input.redirect_uris.map(redirectUri))]
  if (input.token_endpoint_auth_method !== undefined && input.token_endpoint_auth_method !== "none") throw new OAuthError("invalid_client_metadata", "Public clients must use token_endpoint_auth_method none with PKCE.")
  if (input.grant_types !== undefined && (!Array.isArray(input.grant_types) || !input.grant_types.length || input.grant_types.some(value => !["authorization_code", "refresh_token"].includes(value)))) throw new OAuthError("invalid_client_metadata", "Only authorization_code and refresh_token grants are supported.")
  if (input.response_types !== undefined && (!Array.isArray(input.response_types) || input.response_types.length !== 1 || input.response_types[0] !== "code")) throw new OAuthError("invalid_client_metadata", "Only the code response type is supported.")
  if (input.scope !== undefined && typeof input.scope !== "string") throw new OAuthError("invalid_client_metadata", "scope must be a space-separated string.")
  return { name: requireString(input.client_name || "MCP client", "client_name", 100).trim() || "MCP client", redirectUris: redirects, scopes: scopesFrom(input.scope as string | undefined) }
}
