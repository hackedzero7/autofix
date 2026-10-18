import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@/lib/crm-auth"
import { McpOAuthClient, McpOAuthGrant } from "@/lib/mcp-oauth-models"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const json = (data: unknown, status = 200) => NextResponse.json(data, {
  status, headers: { "Cache-Control": "no-store", Vary: "Cookie" },
})

type Grant = {
  _id: unknown
  clientId: string
  scopes: string[]
  createdAt: Date
  expiresAt: Date
}
type Client = { clientId: string; name: string; redirectUris: string[] }

function callbackOrigins(redirectUris: string[]) {
  return [...new Set(redirectUris.flatMap(uri => {
    try { return [new URL(uri).origin] } catch { return [] }
  }))]
}

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) return json({ error: "Please log in." }, 401)
    if (user.role !== "admin") return json({ error: "Administrator access required." }, 403)

    const grants = await McpOAuthGrant.find({ userId: user.id, revokedAt: null, expiresAt: { $gt: new Date() } })
      .select("_id clientId scopes createdAt expiresAt").sort({ createdAt: -1 }).lean() as unknown as Grant[]
    const clients = await McpOAuthClient.find({ clientId: { $in: grants.map(grant => grant.clientId) }, active: true })
      .select("clientId name redirectUris -_id").lean() as unknown as Client[]
    const byClient = new Map(clients.map(client => [client.clientId, client]))

    return json({ connections: grants.flatMap(grant => {
      const client = byClient.get(grant.clientId)
      if (!client) return []
      return [{
        id: String(grant._id), clientName: client.name, callbackOrigins: callbackOrigins(client.redirectUris),
        scopes: grant.scopes, createdAt: grant.createdAt, expiresAt: grant.expiresAt,
      }]
    }) })
  } catch (error) {
    console.error("MCP connections request failed", error instanceof Error ? error.name : "Unknown error")
    return json({ error: "Connections are unavailable. Please try again." }, 503)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (req.headers.get("origin") !== req.nextUrl.origin) return json({ error: "Request origin is not allowed." }, 403)
    const user = await currentUser()
    if (!user) return json({ error: "Please log in." }, 401)
    if (user.role !== "admin") return json({ error: "Administrator access required." }, 403)
    if (req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return json({ error: "A JSON request is required." }, 400)
    }

    const reader = req.body?.getReader()
    if (!reader) return json({ error: "A connection ID is required." }, 400)
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 1024) { await reader.cancel(); return json({ error: "Request is too large." }, 413) }
      chunks.push(value)
    }
    let body: unknown
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")) } catch { return json({ error: "Invalid JSON." }, 400) }
    const grantId = body && typeof body === "object" && "grantId" in body ? body.grantId : undefined
    if (typeof grantId !== "string" || !/^[a-fA-F0-9]{24}$/.test(grantId)) {
      return json({ error: "A valid connection ID is required." }, 400)
    }

    const result = await McpOAuthGrant.updateOne(
      { _id: grantId, userId: user.id, revokedAt: null, expiresAt: { $gt: new Date() } },
      { $set: { revokedAt: new Date() } },
    )
    if (!result.matchedCount) return json({ error: "This active connection was not found. Refresh the list." }, 404)
    return json({ revoked: true })
  } catch (error) {
    console.error("MCP connection revocation failed", error instanceof Error ? error.name : "Unknown error")
    return json({ error: "The connection could not be revoked. Please try again." }, 503)
  }
}
