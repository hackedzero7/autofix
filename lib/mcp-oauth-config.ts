/** Canonical URLs must come from configuration, never the incoming Host header. */
export const MCP_SCOPES = ["blogs:read", "blogs:write", "blogs:delete"] as const
export function oauthServerConfig(env: NodeJS.ProcessEnv = process.env) {
  const configured = env.MCP_SERVER_URL?.trim() || env.NEXT_PUBLIC_SITE_URL?.trim()
  const value = configured || (env.NODE_ENV !== "production" ? "http://localhost:3000" : "")
  if (!value) throw new Error("Set MCP_SERVER_URL to your public HTTPS /mcp URL.")
  let url: URL
  try { url = new URL(value) } catch { throw new Error("MCP_SERVER_URL must be an absolute HTTPS URL.") }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  if ((url.protocol !== "https:" && !(url.protocol === "http:" && local && env.NODE_ENV !== "production")) || url.username || url.password || url.search || value.includes("#") || !["", "/", "/mcp", "/mcp/"].includes(url.pathname)) {
    throw new Error("MCP_SERVER_URL must be an HTTPS origin or its /mcp URL; localhost HTTP is allowed only in development.")
  }
  return { origin: url.origin, issuer: url.origin, resource: `${url.origin}/mcp` }
}

export function oauthResourceMetadata() {
  const config = oauthServerConfig()
  return { resource: config.resource, authorization_servers: [config.issuer], scopes_supported: [...MCP_SCOPES], bearer_methods_supported: ["header"], resource_name: "Pro Auto Care blog management" }
}

/** Only the OAuth consent route may be used as an admin-login return target. */
export function safeOAuthReturnTo(value: unknown) {
  if (typeof value !== "string" || value.length > 8192 || !value.startsWith("/oauth/authorize?") || /[\\\r\n]/.test(value)) return "/crm/admin"
  try {
    const url = new URL(value, "https://internal.invalid")
    return url.origin === "https://internal.invalid" && url.pathname === "/oauth/authorize" && !url.hash ? `${url.pathname}${url.search}` : "/crm/admin"
  } catch { return "/crm/admin" }
}
