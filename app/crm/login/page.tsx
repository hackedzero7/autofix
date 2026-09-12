import { redirect } from "next/navigation"
import { currentUser } from "@/lib/crm-auth"
import LoginForm from "@/components/crm/login-form"
export default async function LoginPage() {
  const user = await currentUser()
  if (user) redirect("/crm/admin")
  return <LoginForm />
}
