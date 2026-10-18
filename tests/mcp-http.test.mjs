import test from "node:test"
import assert from "node:assert/strict"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import { registerBlogTools } from "../lib/mcp-blog-tools.ts"
import { createMcpHttpHandler } from "../lib/mcp-http.ts"

const origin = "https://blogs.example"
const identity = { userId: "admin-one", scopes: ["blogs:read"] }
let serversCreated = 0
const handle = createMcpHttpHandler({
  config: () => ({ origin, resource: `${origin}/mcp` }),
  authenticate: async request => request.headers.get("authorization") === "Bearer valid" ? identity : null,
  allowedOrigins: () => ["https://inspector.example"],
  createServer(auth) {
    serversCreated++
    const server = new McpServer({ name: "test-blog-server", version: "1.0.0" })
    server.registerTool("whoami", { inputSchema: {}, annotations: { readOnlyHint: true } }, async () => ({ content: [{ type: "text", text: auth.userId }] }))
    return server
  },
})

function request(body, extra = {}) {
  return new Request(`${origin}/mcp`, {
    method: "POST",
    headers: { Authorization: "Bearer valid", "Content-Type": "application/json", Accept: "application/json, text/event-stream", ...extra },
    body: typeof body === "string" ? body : JSON.stringify(body),
  })
}
const rpc = (method, params = {}) => ({ jsonrpc: "2.0", id: 1, method, params })

test("anonymous and invalid tokens get OAuth discovery without creating a server", async () => {
  const before = serversCreated
  for (const token of ["", "Bearer wrong"]) {
    const response = await handle(request("malformed private payload", { Authorization: token }))
    assert.equal(response.status, 401)
    assert.match(response.headers.get("www-authenticate"), /oauth-protected-resource\/mcp/)
    assert.equal(response.headers.get("cache-control"), "no-store")
    assert.doesNotMatch(await response.text(), /private payload/)
  }
  assert.equal(serversCreated, before)
})

test("stateless SDK initialize, tool discovery and execution work on separate requests", async () => {
  const initialized = await handle(request(rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "1" } })))
  assert.equal(initialized.status, 200)
  assert.equal((await initialized.json()).result.serverInfo.name, "test-blog-server")
  assert.equal(initialized.headers.get("mcp-session-id"), null)
  for (let i = 0; i < 2; i++) {
    const listed = await handle(request(rpc("tools/list")))
    assert.equal(listed.status, 200)
    assert.equal((await listed.json()).result.tools[0].name, "whoami")
  }
  const called = await handle(request(rpc("tools/call", { name: "whoami", arguments: {} })))
  assert.equal(called.status, 200)
  assert.equal((await called.json()).result.content[0].text, identity.userId)
  const notified = await handle(request({ jsonrpc: "2.0", method: "notifications/initialized" }))
  assert.equal(notified.status, 202)
})

test("unapproved browser origins fail before authentication and approved preflights work", async () => {
  const denied = await handle(request(rpc("tools/list"), { Origin: "https://untrusted.example" }))
  assert.equal(denied.status, 403)
  assert.equal(denied.headers.get("access-control-allow-origin"), null)
  const preflight = await handle(new Request(`${origin}/mcp`, { method: "OPTIONS", headers: { Origin: "https://inspector.example" } }))
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get("access-control-allow-origin"), "https://inspector.example")
  assert.match(preflight.headers.get("access-control-allow-headers"), /Authorization/)
})

test("bad content, invalid JSON and oversized JSON are rejected without running tools", async () => {
  const before = serversCreated
  for (const [body, headers, status] of [
    ["{}", { "Content-Type": "text/plain" }, 415],
    ["{", {}, 400],
    ["x".repeat(2 * 1024 * 1024 + 1), {}, 413],
    ["{}", { "Content-Length": String(2 * 1024 * 1024 + 1) }, 413],
  ]) {
    assert.equal((await handle(request(body, headers))).status, status)
  }
  assert.equal(serversCreated, before)
})

test("GET and DELETE authenticate then report stateless transport methods", async () => {
  for (const method of ["GET", "DELETE"]) {
    const denied = await handle(new Request(`${origin}/mcp`, { method }))
    assert.equal(denied.status, 401)
    const response = await handle(new Request(`${origin}/mcp`, { method, headers: { Authorization: "Bearer valid" } }))
    assert.equal(response.status, 405)
    assert.match(response.headers.get("allow"), /POST/)
  }
})

test("SDK validates JSON-RPC and content negotiation", async () => {
  const invalid = await handle(request({ jsonrpc: "2.0", id: 1, method: 123 }))
  assert.equal(invalid.status, 400)
  const accept = await handle(request(rpc("tools/list"), { Accept: "application/json" }))
  assert.equal(accept.status, 406)
})

test("configuration and token storage failures produce a sanitized service error", async () => {
  const unavailable = createMcpHttpHandler({ config: () => { throw new Error("secret database password") }, authenticate: async () => null, createServer: () => { throw new Error("unexpected") } })
  const response = await unavailable(request(rpc("tools/list")))
  assert.equal(response.status, 503)
  assert.doesNotMatch(await response.text(), /secret database password/)
})

test("a real MCP client discovers blog schemas, validates content and reads writing resources", async () => {
  const repo = {
    list: async () => ({ posts: [], total: 0 }),
    get: async () => null,
    create: async () => { throw new Error("No writes expected") },
    update: async () => { throw new Error("No writes expected") },
    delete: async () => { throw new Error("No writes expected") },
  }
  const blogHandler = createMcpHttpHandler({
    config: () => ({ origin, resource: `${origin}/mcp` }), authenticate: async () => identity,
    createServer(auth) {
      const server = new McpServer({ name: "real-blog-tools", version: "1.0.0" })
      registerBlogTools(server, auth, repo)
      return server
    },
  })
  const client = new Client({ name: "integration-test", version: "1" })
  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`), {
    fetch: async (input, init) => blogHandler(new Request(input, init)),
  })
  try {
    await client.connect(transport)
    const { tools } = await client.listTools()
    assert.equal(tools.length, 6)
    assert.ok(tools.find(tool => tool.name === "blogs_update").inputSchema.required.includes("expectedUpdatedAt"))
    const listed = await client.callTool({ name: "blogs_list", arguments: {} })
    assert.equal(listed.structuredContent.total, 0)
    const validated = await client.callTool({ name: "blogs_validate", arguments: { post: {
      title: "Test article", slug: "test-article", excerpt: "An accurate summary", category: "Maintenance",
      author: "Pro Auto Care", readingTime: "1 min read", publishedAt: "2026-10-18", content: [{ paragraphs: ["Original article text."] }],
    } } })
    assert.equal(validated.structuredContent.post.status, "draft")
    const resource = await client.readResource({ uri: "blog://writing-guide" })
    assert.equal(JSON.parse(resource.contents[0].text).site, "Pro Auto Care")
    const prompt = await client.getPrompt({ name: "weekly_articles", arguments: { weekStart: "2026-10-19" } })
    assert.match(prompt.messages[0].content.text, /exactly two/)
    const forbidden = await client.callTool({ name: "blogs_create", arguments: { post: {} } })
    assert.equal(forbidden.isError, true)
  } finally { await client.close() }
})
