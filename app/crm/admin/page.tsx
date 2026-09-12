import { redirect } from "next/navigation"
import { currentUser } from "@/lib/crm-auth"
import Dashboard from "@/components/crm/dashboard"
export default async function AdminPage() {
  const user = await currentUser()
  if (!user) redirect("/crm/login")
  if (user.role !== "admin") redirect("/crm/login")
  return <Dashboard user={user} />
}
