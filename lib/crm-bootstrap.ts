import { createHash, timingSafeEqual } from "node:crypto"

// Only credentials configured by the server can provision an administrator.
export function matchingEnvAdmin(input: { email: string; password: string }, env: Record<string, string | undefined> = process.env) {
  const email = env.CRM_ADMIN_EMAIL?.trim().toLowerCase()
  const password = env.CRM_ADMIN_PASSWORD
  if (!email || !password || password.length > 128 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  const hash = (value: string) => createHash("sha256").update(value).digest()
  const passwordMatches = timingSafeEqual(hash(input.password), hash(password))
  if (input.email.trim().toLowerCase() !== email || !passwordMatches) return null
  return { email, password, name: env.CRM_ADMIN_NAME?.trim() || "Administrator" }
}
