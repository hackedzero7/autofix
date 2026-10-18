import { oauthEndpoint, oauthJson, oauthOptions, oauthResourceMetadata } from "@/lib/mcp-oauth"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const OPTIONS = oauthOptions
export const GET = () => oauthEndpoint(async () => oauthJson(oauthResourceMetadata()))
