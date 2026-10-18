import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

export type McpIdentity = { userId: string; scopes: string[]; clientId?: string }
type Dependencies = {
  config: () => { origin: string; resource: string }
  authenticate: (request: Request) => Promise<McpIdentity | null>
  createServer: (identity: McpIdentity) => McpServer
  allowedOrigins?: () => string[]
}
const maxBodyBytes = 2 * 1024 * 1024

class RequestError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new RequestError(415, "Use Content-Type: application/json.")
  }
  if (Number(request.headers.get("content-length")) > maxBodyBytes) throw new RequestError(413, "MCP requests must be smaller than 2 MB.")
  const reader = request.body?.getReader()
  if (!reader) throw new RequestError(400, "A JSON-RPC body is required.")
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBodyBytes) {
      await reader.cancel()
      throw new RequestError(413, "MCP requests must be smaller than 2 MB.")
    }
    chunks.push(value)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) }
  catch { throw new RequestError(400, "Invalid JSON.") }
}

// A new server and transport per request avoids instance-local sessions on Vercel.
export function createMcpHttpHandler(dependencies: Dependencies) {
  return async function handle(request: Request): Promise<Response> {
    const headers = new Headers({ "Cache-Control": "no-store", Vary: "Origin", "X-Content-Type-Options": "nosniff" })
    const json = (message: string, status: number) => Response.json({ error: message }, { status, headers })
    let server: McpServer | undefined
    try {
      const config = dependencies.config()
      const origin = request.headers.get("origin")
      const allowed = new Set([config.origin, ...(dependencies.allowedOrigins?.() || [])])
      if (origin && !allowed.has(origin)) return json("Request origin is not allowed.", 403)
      if (origin) {
        headers.set("Access-Control-Allow-Origin", origin)
        headers.set("Access-Control-Expose-Headers", "WWW-Authenticate, MCP-Protocol-Version")
      }
      if (request.method === "OPTIONS") {
        headers.set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS")
        headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID")
        return new Response(null, { status: 204, headers })
      }
      const identity = await dependencies.authenticate(request)
      if (!identity) {
        const invalidToken = request.headers.has("authorization") ? ', error="invalid_token"' : ""
        headers.set("WWW-Authenticate", `Bearer resource_metadata="${config.origin}/.well-known/oauth-protected-resource/mcp", scope="blogs:read blogs:write blogs:delete"${invalidToken}`)
        return json("Authorize an active CRM administrator to use this MCP server.", 401)
      }
      if (request.method !== "POST") {
        headers.set("Allow", "POST, OPTIONS")
        return json("This stateless MCP server uses POST; persistent SSE sessions are not supported.", 405)
      }
      const parsedBody = await readJson(request)
      server = dependencies.createServer(identity)
      const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true })
      await server.connect(transport)
      const response = await transport.handleRequest(request, { parsedBody })
      for (const [key, value] of headers) response.headers.set(key, value)
      return response
    } catch (error) {
      if (error instanceof RequestError) return json(error.message, error.status)
      console.error("MCP request failed", error instanceof Error ? error.name : "Unknown error")
      return json("MCP is unavailable. Check the server configuration and database connection.", 503)
    } finally {
      await server?.close().catch(() => undefined)
    }
  }
}
