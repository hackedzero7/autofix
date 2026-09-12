import { createHash, randomBytes } from "node:crypto"
import { cookies } from "next/headers"
import { connectDB } from "./mongodb"
import { CrmSession, CrmUser } from "./crm-models"

export { hashPassword, verifyPassword } from "./crm-password"
export const cookieName = "crm_session"
export const digest = (value: string) => createHash("sha256").update(value).digest("hex")
export async function currentUser() {
  const token = (await cookies()).get(cookieName)?.value
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null
  await connectDB()
  const session = await CrmSession.findOne({ tokenHash: digest(token), expiresAt: { $gt: new Date() } })
  if (!session) return null
  const user = await CrmUser.findOne({ _id: session.userId, active: true, role: "admin" })
  return user ? { id: String(user._id), name: String(user.name), email: String(user.email), role: String(user.role) } : null
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  await CrmSession.create({ tokenHash: digest(token), userId, expiresAt: expires })
  ;(await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires })
}
