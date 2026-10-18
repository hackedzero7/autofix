import { redirect } from "next/navigation"
import { currentUser } from "@/lib/crm-auth"
import LoginForm from "@/components/crm/login-form"
import { safeOAuthReturnTo } from "@/lib/mcp-oauth-config"
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const returnTo = safeOAuthReturnTo((await searchParams).returnTo)
  const user = await currentUser()
  if (user) redirect(returnTo)
  return <LoginForm returnTo={returnTo} />
}
