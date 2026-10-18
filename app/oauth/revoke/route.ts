import { oauthEndpoint, oauthOptions, revokeToken } from "@/lib/mcp-oauth"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const OPTIONS = oauthOptions
export const POST = (request: Request) => oauthEndpoint(() => revokeToken(request))
