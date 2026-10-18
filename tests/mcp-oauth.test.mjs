import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import mongoose from "mongoose"
import { oauthServerConfig, oauthResourceMetadata, safeOAuthReturnTo } from "../lib/mcp-oauth-config.ts"
import { OAuthError, hashToken, opaqueToken, readOAuthBody, redirectUri, registrationInput, requireResource, scopesFrom, singleParams, validOpaqueToken, verifyPkce } from "../lib/mcp-oauth-validation.ts"
import { McpOAuthClient, McpOAuthCode, McpOAuthConsent, McpOAuthGrant, McpOAuthRate, McpOAuthToken } from "../lib/mcp-oauth-models.ts"
import { CrmUser } from "../lib/crm-models.ts"
import { verifyMcpBearer } from "../lib/mcp-auth.ts"
import { authorizePost, exchangeToken, oauthEndpoint } from "../lib/mcp-oauth.ts"

test("OAuth canonical resource uses configured HTTPS URL and fails closed in production", () => {
  for (const value of ["https://example.com", "https://example.com/mcp", "https://example.com/mcp/"]) assert.deepEqual(oauthServerConfig({ NODE_ENV: "production", MCP_SERVER_URL: value }), { origin: "https://example.com", issuer: "https://example.com", resource: "https://example.com/mcp" })
  for (const value of ["http://example.com", "https://user:pass@example.com", "https://example.com/other", "https://example.com?evil=1", "https://example.com/#fragment", "http://localhost:3000"]) assert.throws(() => oauthServerConfig({ NODE_ENV: "production", MCP_SERVER_URL: value }))
  assert.throws(() => oauthServerConfig({ NODE_ENV: "production" }))
  assert.equal(oauthServerConfig({ NODE_ENV: "development" }).resource, "http://localhost:3000/mcp")
})

test("login return targets are restricted to internal OAuth consent", () => {
  const valid = "/oauth/authorize?client_id=one&resource=https%3A%2F%2Fexample.com%2Fmcp"
  assert.equal(safeOAuthReturnTo(valid), valid)
  for (const value of ["https://evil.com", "//evil.com", "/\\evil.com", "/oauth/authorize?x=1#evil", "/oauth/authorize/evil?x=1", "/oauth/authorize?x=1\r\nLocation:evil", null, [valid]]) assert.equal(safeOAuthReturnTo(value), "/crm/admin")
})

test("DCR accepts public code/refresh clients with exact secure redirect URIs", () => {
  const result = registrationInput({ client_name: "Test agent", redirect_uris: ["https://chat.example/callback", "http://127.0.0.1:1234/callback"], token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], scope: "blogs:read blogs:write" })
  assert.deepEqual(result.scopes, ["blogs:read", "blogs:write"])
  assert.equal(result.redirectUris.length, 2)
  for (const input of [{ redirect_uris: [] }, { redirect_uris: ["https://example.com/*"] }, { redirect_uris: ["https://example.com/#fragment"] }, { redirect_uris: ["http://example.com/callback"] }, { redirect_uris: ["javascript:alert(1)"] }, { redirect_uris: ["https://user:pass@example.com/callback"] }, { redirect_uris: ["https://example.com/callback"], token_endpoint_auth_method: "client_secret_basic" }, { redirect_uris: ["https://example.com/callback"], response_types: ["token"] }, { redirect_uris: ["https://example.com/callback"], scope: "admin" }, { redirect_uris: ["https://example.com/callback"], grant_types: ["password"] }]) assert.throws(() => registrationInput(input), OAuthError)
  assert.equal(redirectUri("https://example.com/callback?exact=1"), "https://example.com/callback?exact=1")
  assert.throws(() => redirectUri("https://example.com/callback#"))
})

test("PKCE requires a valid S256 verifier and constant digest binding", () => {
  const verifier = "a".repeat(43), challenge = createHash("sha256").update(verifier).digest("base64url")
  assert.equal(verifyPkce(verifier, challenge), true)
  assert.equal(verifyPkce("b".repeat(43), challenge), false)
  assert.equal(verifyPkce("short", challenge), false)
  assert.equal(verifyPkce("a".repeat(129), challenge), false)
  assert.equal(verifyPkce("!".repeat(43), challenge), false)
  const token = opaqueToken("access")
  assert.equal(validOpaqueToken(token, "access"), true)
  assert.equal(validOpaqueToken(token, "refresh"), false)
  assert.equal(hashToken(token).length, 64)
  assert.notEqual(hashToken(token), token)
})

test("OAuth scopes cannot escalate and resource identifiers must match exactly", () => {
  assert.deepEqual(scopesFrom("blogs:read", ["blogs:read", "blogs:write"]), ["blogs:read"])
  assert.throws(() => scopesFrom("blogs:delete", ["blogs:read"]))
  assert.throws(() => scopesFrom(""))
  for (const target of [undefined, "https://evil.com/mcp", "https://example.com/mcp/"]) assert.throws(() => requireResource(target, "https://example.com/mcp"))
  assert.doesNotThrow(() => requireResource("https://example.com/mcp", "https://example.com/mcp"))
})

test("OAuth request parsing rejects duplicate params, malformed JSON, and oversized streamed bodies", async () => {
  assert.throws(() => singleParams(new URLSearchParams("client_id=one&client_id=two")))
  assert.deepEqual(singleParams(new URLSearchParams("__proto__=safe&client_id=test")).client_id, "test")
  const req = (body, type = "application/x-www-form-urlencoded") => new Request("https://example.com/oauth/token", { method: "POST", headers: { "Content-Type": type }, body })
  await assert.rejects(() => readOAuthBody(req("x=1&x=2"), "form"))
  await assert.rejects(() => readOAuthBody(req("{", "application/json"), "json"))
  await assert.rejects(() => readOAuthBody(req("[]", "application/json"), "json"))
  await assert.rejects(() => readOAuthBody(req("x=" + "x".repeat(16384)), "form"), error => error.status === 413)
  await assert.rejects(() => readOAuthBody(req("x=1", "text/plain"), "form"), error => error.status === 415)
})

test("browser consent accepts absent or foreign origins but validates the consent response", async () => {
  const previousUrl = process.env.MCP_SERVER_URL
  process.env.MCP_SERVER_URL = "https://example.com/mcp"
  try {
    for (const origin of [undefined, "https://evil.example", "null", "https://example.com.evil.example"]) {
      const headers = { "Content-Type": "application/x-www-form-urlencoded" }
      if (origin !== undefined) headers.Origin = origin
      const request = new Request("https://example.com/oauth/authorize", { method: "POST", headers, body: "decision=approve" })
      const response = await oauthEndpoint(() => authorizePost(request))
      assert.equal(response.status, 400)
      assert.equal((await response.json()).error, "invalid_request")
    }
  } finally {
    if (previousUrl === undefined) delete process.env.MCP_SERVER_URL; else process.env.MCP_SERVER_URL = previousUrl
  }
})

test("authorization artifacts and rate counters have TTLs, only token hashes are persisted", () => {
  for (const model of [McpOAuthCode, McpOAuthConsent, McpOAuthGrant, McpOAuthToken, McpOAuthRate]) assert.ok(model.schema.indexes().some(([keys, options]) => keys.expiresAt === 1 && options.expireAfterSeconds === 0), model.modelName)
  for (const model of [McpOAuthCode, McpOAuthConsent, McpOAuthToken]) {
    assert.ok(model.schema.indexes().some(([keys, options]) => keys.tokenHash === 1 && options.unique))
    assert.equal(model.schema.path("accessToken"), undefined)
    assert.equal(model.schema.path("refreshToken"), undefined)
  }
  assert.ok(McpOAuthCode.schema.path("consumedAt"))
  assert.ok(McpOAuthToken.schema.path("consumedAt"))
  assert.ok(McpOAuthToken.schema.path("scopes"))
})

test("bearer verification enforces audience, grant revocation, active client/admin, and token scopes", async () => {
  const previousUrl = process.env.MCP_SERVER_URL, previousUri = process.env.MONGODB_URI, previousConnection = globalThis.mongoConnection
  const originals = [McpOAuthToken.findOne, McpOAuthGrant.findOne, McpOAuthClient.exists, CrmUser.exists]
  process.env.MCP_SERVER_URL = "https://example.com/mcp"
  process.env.MONGODB_URI = "mongodb://mocked-no-network"
  globalThis.mongoConnection = Promise.resolve(mongoose)
  const token = opaqueToken("access"), clientId = opaqueToken("client"), grantId = "0123456789abcdef01234567", userId = "abcdef0123456789abcdef01"
  let grantAvailable = true, activeClient = true, activeAdmin = true
  McpOAuthToken.findOne = async filter => {
    assert.equal(filter.tokenHash, hashToken(token))
    assert.equal(filter.type, "access")
    assert.ok(filter.expiresAt.$gt instanceof Date)
    return { grantId, clientId, scopes: ["blogs:read", "blogs:delete"] }
  }
  McpOAuthGrant.findOne = async filter => {
    assert.equal(filter.resource, "https://example.com/mcp")
    assert.equal(filter.revokedAt, null)
    assert.equal(filter.clientId, clientId)
    assert.equal(filter._id, grantId)
    assert.ok(filter.expiresAt.$gt instanceof Date)
    return grantAvailable ? { userId, scopes: ["blogs:read", "blogs:write"] } : null
  }
  McpOAuthClient.exists = async filter => { assert.equal(filter.active, true); return activeClient ? { _id: clientId } : null }
  CrmUser.exists = async filter => { assert.deepEqual(filter, { _id: userId, active: true, role: "admin" }); return activeAdmin ? { _id: userId } : null }
  const request = (authorization = `Bearer ${token}`) => new Request("https://evil-host.invalid/mcp", { headers: { authorization } })
  try {
    assert.deepEqual(await verifyMcpBearer(request()), { userId, scopes: ["blogs:read"], clientId })
    grantAvailable = false; assert.equal(await verifyMcpBearer(request()), null); grantAvailable = true
    activeClient = false; assert.equal(await verifyMcpBearer(request()), null); activeClient = true
    activeAdmin = false; assert.equal(await verifyMcpBearer(request()), null)
    for (const value of ["Basic abc", `Bearer ${opaqueToken("refresh")}`, `Bearer ${token} extra`, token, ""]) assert.equal(await verifyMcpBearer(request(value)), null)
  } finally {
    ;[McpOAuthToken.findOne, McpOAuthGrant.findOne, McpOAuthClient.exists, CrmUser.exists] = originals
    if (previousUrl === undefined) delete process.env.MCP_SERVER_URL; else process.env.MCP_SERVER_URL = previousUrl
    if (previousUri === undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI = previousUri
    globalThis.mongoConnection = previousConnection
  }
})

// Exercise the real exchange/revocation code with a deterministic persistent-model
// adapter. These tests never open a database connection or make a network request.
async function withExchangeStore(run) {
  const previousUrl = process.env.MCP_SERVER_URL, previousUri = process.env.MONGODB_URI, previousConnection = globalThis.mongoConnection
  process.env.MCP_SERVER_URL = "https://example.com/mcp"
  process.env.MONGODB_URI = "mongodb://mocked-no-network"
  globalThis.mongoConnection = Promise.resolve(mongoose)
  const patched = []
  const patch = (model, key, fn) => { patched.push([model, key, model[key]]); model[key] = fn }
  const resource = "https://example.com/mcp", clientId = opaqueToken("client"), code = opaqueToken("code"), verifier = "a".repeat(43)
  const grant = { _id: "0123456789abcdef01234567", userId: "abcdef0123456789abcdef01", clientId, resource, scopes: ["blogs:read", "blogs:write", "blogs:delete"], expiresAt: new Date(Date.now() + 30 * 86400000) }
  const codeRecord = { tokenHash: hashToken(code), grantId: grant._id, clientId, resource, redirectUri: "https://client.example/callback", codeChallenge: createHash("sha256").update(verifier).digest("base64url"), expiresAt: new Date(Date.now() + 300000) }
  const tokens = new Map()
  const state = { activeAdmin: true, activeClient: true, grant, codeRecord, tokens, resource, clientId, code, verifier }
  const matches = (record, filter) => !!record && Object.entries(filter).every(([key, value]) => {
    if (key === "expiresAt") return record.expiresAt > value.$gt
    if (value === null) return record[key] == null
    return String(record[key]) === String(value)
  })
  patch(McpOAuthRate, "init", async () => McpOAuthRate)
  patch(McpOAuthRate, "findOneAndUpdate", async () => ({ count: 1 }))
  patch(McpOAuthClient, "findOne", async filter => filter.clientId === clientId && state.activeClient ? { clientId, redirectUris: [codeRecord.redirectUri], scopes: grant.scopes } : null)
  patch(McpOAuthClient, "exists", async () => state.activeClient ? { _id: clientId } : null)
  patch(CrmUser, "exists", async () => state.activeAdmin ? { _id: grant.userId } : null)
  patch(McpOAuthCode, "findOne", async filter => matches(codeRecord, filter) ? { ...codeRecord } : null)
  patch(McpOAuthCode, "findOneAndUpdate", async (filter, update) => {
    if (!matches(codeRecord, filter)) return null
    const before = { ...codeRecord }; Object.assign(codeRecord, update.$set); return before
  })
  patch(McpOAuthGrant, "findOne", async filter => matches(grant, filter) ? grant : null)
  patch(McpOAuthGrant, "updateOne", async (filter, update) => { if (String(filter._id) === grant._id) Object.assign(grant, update.$set); return { modifiedCount: 1 } })
  patch(McpOAuthToken, "insertMany", async records => { for (const record of records) tokens.set(record.tokenHash, { ...record }); return records })
  patch(McpOAuthToken, "findOne", async filter => { const record = tokens.get(filter.tokenHash); return matches(record, filter) ? { ...record } : null })
  patch(McpOAuthToken, "findOneAndUpdate", async (filter, update) => {
    const record = tokens.get(filter.tokenHash)
    if (!matches(record, filter)) return null
    const before = { ...record }; Object.assign(record, update.$set); return before
  })
  state.exchange = async values => {
    const request = new Request("https://example.com/oauth/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: clientId, resource, ...values }) })
    const response = await oauthEndpoint(() => exchangeToken(request))
    return { status: response.status, data: await response.json(), headers: response.headers }
  }
  state.authorizeCode = values => state.exchange({ grant_type: "authorization_code", code, code_verifier: verifier, redirect_uri: codeRecord.redirectUri, ...values })
  try { await run(state) } finally {
    for (const [model, key, original] of patched.reverse()) model[key] = original
    if (previousUrl === undefined) delete process.env.MCP_SERVER_URL; else process.env.MCP_SERVER_URL = previousUrl
    if (previousUri === undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI = previousUri
    globalThis.mongoConnection = previousConnection
  }
}

test("authorization codes bind client, audience, callback and PKCE, consume once, and revoke on valid replay", async () => {
  await withExchangeStore(async state => {
    for (const values of [{ code_verifier: "wrong".repeat(12) }, { redirect_uri: "https://evil.example/callback" }, { resource: "https://evil.example/mcp" }, { client_id: opaqueToken("client") }]) {
      assert.ok((await state.authorizeCode(values)).status >= 400)
      assert.equal(state.codeRecord.consumedAt, undefined)
    }
    state.activeAdmin = false
    assert.equal((await state.authorizeCode()).data.error, "invalid_grant")
    assert.equal(state.codeRecord.consumedAt, undefined)
    state.activeAdmin = true
    const first = await state.authorizeCode()
    assert.equal(first.status, 200)
    assert.equal(first.data.token_type, "Bearer")
    assert.ok(first.data.expires_in > 3500 && first.data.expires_in <= 3600)
    assert.equal(first.headers.get("cache-control"), "no-store")
    assert.ok(state.codeRecord.consumedAt instanceof Date)
    assert.ok(state.tokens.has(hashToken(first.data.access_token)))
    assert.equal(state.tokens.has(first.data.access_token), false)
    assert.equal((await state.authorizeCode()).data.error, "invalid_grant")
    assert.ok(state.grant.revokedAt instanceof Date)
    assert.equal(await verifyMcpBearer(new Request(state.resource, { headers: { authorization: `Bearer ${first.data.access_token}` } })), null)
  })
})

test("refresh tokens rotate, preserve an absolute expiry, downscope without escalation, and revoke on reuse", async () => {
  await withExchangeStore(async state => {
    const original = (await state.authorizeCode()).data
    const refresh = values => state.exchange({ grant_type: "refresh_token", refresh_token: original.refresh_token, ...values })
    assert.equal((await refresh({ resource: "https://evil.example/mcp" })).data.error, "invalid_target")
    assert.equal((await refresh({ scope: "admin" })).data.error, "invalid_scope")
    state.activeAdmin = false
    assert.equal((await refresh()).data.error, "invalid_grant")
    assert.equal(state.tokens.get(hashToken(original.refresh_token)).consumedAt, undefined)
    state.activeAdmin = true
    const rotated = await refresh({ scope: "blogs:read" })
    assert.equal(rotated.status, 200)
    assert.notEqual(rotated.data.refresh_token, original.refresh_token)
    assert.equal(rotated.data.scope, "blogs:read")
    assert.deepEqual(state.tokens.get(hashToken(rotated.data.access_token)).scopes, ["blogs:read"])
    assert.equal(state.tokens.get(hashToken(rotated.data.refresh_token)).expiresAt.getTime(), state.grant.expiresAt.getTime())
    const escalation = await state.exchange({ grant_type: "refresh_token", refresh_token: rotated.data.refresh_token, scope: "blogs:write" })
    assert.equal(escalation.data.error, "invalid_scope")
    const beforeReplay = await verifyMcpBearer(new Request(state.resource, { headers: { authorization: `Bearer ${rotated.data.access_token}` } }))
    assert.deepEqual(beforeReplay.scopes, ["blogs:read"])
    assert.equal((await refresh()).data.error, "invalid_grant")
    assert.ok(state.grant.revokedAt instanceof Date)
    assert.equal(await verifyMcpBearer(new Request(state.resource, { headers: { authorization: `Bearer ${rotated.data.access_token}` } })), null)
  })
})
