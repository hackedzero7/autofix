import { redirect } from "next/navigation"
import { currentUser } from "@/lib/crm-auth"
export default async function CrmPage() {
  const user = await currentUser()
  redirect(!user ? "/crm/login" : "/crm/admin")
}
