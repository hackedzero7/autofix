import { connectDB } from "./mongodb"
import { CrmUser } from "./crm-models"
import { oauthServerConfig } from "./mcp-oauth-config.ts"
import { McpOAuthClient, McpOAuthGrant, McpOAuthToken } from "./mcp-oauth-models.ts"
import { hashToken, validOpaqueToken } from "./mcp-oauth-validation.ts"

export async function verifyMcpBearer(request: Request): Promise<{ userId: string; scopes: string[]; clientId?: string } | null> {
  const value = request.headers.get("authorization")
  const match = value?.match(/^Bearer (mcp_access_[A-Za-z0-9_-]{43})$/i)
  if (!match || !validOpaqueToken(match[1], "access")) return null
  const { resource } = oauthServerConfig()
  await connectDB()
  const token = await McpOAuthToken.findOne({ tokenHash: hashToken(match[1]), type: "access", expiresAt: { $gt: new Date() } })
  if (!token) return null
  const grant = await McpOAuthGrant.findOne({ _id: token.grantId, clientId: token.clientId, resource, revokedAt: null, expiresAt: { $gt: new Date() } })
  if (!grant || !await McpOAuthClient.exists({ clientId: token.clientId, active: true })) return null
  if (!await CrmUser.exists({ _id: grant.userId, active: true, role: "admin" })) return null
  const scopes = (token.scopes as string[]).filter(scope => grant.scopes.includes(scope))
  return { userId: String(grant.userId), scopes, clientId: token.clientId }
}
export { oauthResourceMetadata } from "./mcp-oauth-config.ts"
