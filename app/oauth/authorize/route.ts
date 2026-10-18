import { authorizeGet, authorizePost, oauthEndpoint } from "@/lib/mcp-oauth"
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const GET = (request: Request) => oauthEndpoint(() => authorizeGet(request))
export const POST = (request: Request) => oauthEndpoint(() => authorizePost(request))
