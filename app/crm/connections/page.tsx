import { redirect } from "next/navigation"
import { currentUser } from "@/lib/crm-auth"
import McpConnections from "@/components/crm/mcp-connections"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function ConnectionsPage() {
  const user = await currentUser()
  if (!user || user.role !== "admin") redirect("/crm/login")
  return <McpConnections user={{ name: user.name, email: user.email }} />
}
