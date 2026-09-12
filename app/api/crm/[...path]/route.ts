import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { isValidObjectId } from "mongoose"
import { ZodError } from "zod"
import { connectDB } from "@/lib/mongodb"
import { CrmBlog, CrmSession, CrmUser, LoginAttempt } from "@/lib/crm-models"
import { cookieName, createSession, currentUser, digest, hashPassword, verifyPassword } from "@/lib/crm-auth"
import { blogInput, loginInput, parseImport } from "@/lib/crm-validation"

import { matchingEnvAdmin } from "@/lib/crm-bootstrap"

export const runtime = "nodejs"
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } })
class HttpError extends Error { constructor(public status: number, message: string) { super(message) } }
async function body(req: NextRequest) {
  const reader = req.body?.getReader()
  if (!reader) throw new HttpError(400, "A JSON body is required.")
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 2 * 1024 * 1024) { await reader.cancel(); throw new HttpError(413, "JSON must be smaller than 2 MB.") }
    chunks.push(value)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) } catch { throw new HttpError(400, "Invalid JSON.") }
}
async function handle(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params
    const route = path.join("/")
    const method = req.method
    if (method !== "GET") {
      const origin = req.headers.get("origin")
      if (!origin || origin !== req.nextUrl.origin) throw new HttpError(403, "Request origin is not allowed.")
    }
    if (route === "login" && method === "POST") {
      const input = loginInput.parse(await body(req))
      if (!process.env.MONGODB_URI?.trim()) {
        throw new HttpError(503, "Admin login is not configured. Set MONGODB_URI in .env or .env.local and restart the server. .env.example is not loaded by the app.")
      }
      await connectDB()
      const key = digest(input.email)
      await LoginAttempt.deleteOne({ key, expiresAt: { $lte: new Date() } })
      const attempt = await LoginAttempt.findOneAndUpdate({ key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 15 * 60 * 1000) } }, { upsert: true, new: true })
      if (attempt.count > 10) throw new HttpError(429, "Too many login attempts. Try again in 15 minutes.")
      const configuredAdmin = matchingEnvAdmin(input)
      if (configuredAdmin) {
        await CrmUser.init()
        // Insert once. Existing passwords, disabled accounts, and roles are never overwritten.
        try {
          await CrmUser.updateOne({ email: configuredAdmin.email }, { $setOnInsert: {
            email: configuredAdmin.email,
            name: configuredAdmin.name,
            passwordHash: await hashPassword(configuredAdmin.password),
            role: "admin",
            active: true,
          } }, { upsert: true, runValidators: true })
        } catch (error) {
          // A simultaneous first login may already have created this email.
          if ((error as { code?: number }).code !== 11000) throw error
        }
      }
      const user = await CrmUser.findOne({ email: input.email, active: true, role: "admin" })
      const valid = await verifyPassword(input.password, user?.passwordHash || `${"0".repeat(32)}:${"0".repeat(128)}`)
      if (!user || !valid) throw new HttpError(401, "Email or password is incorrect.")
      await LoginAttempt.deleteOne({ key })
      await createSession(String(user._id))
      return json({ redirect: "/crm/admin" })
    }
    if (route === "logout" && method === "POST") {
      const jar = await cookies()
      const token = jar.get(cookieName)?.value
      if (token) { await connectDB(); await CrmSession.deleteOne({ tokenHash: digest(token) }) }
      jar.delete(cookieName)
      return json({ ok: true })
    }
    const user = await currentUser()
    if (!user) throw new HttpError(401, "Please log in.")
    if (user.role !== "admin") throw new HttpError(403, "Administrator access required.")
    // All blog operations below require an active administrator.
    if (route === "blogs" && method === "GET") return json(await CrmBlog.find({}).sort({ updatedAt: -1 }).lean())
    if (route === "blogs" && method === "POST") {
      const input = blogInput.parse(await body(req))
      await CrmBlog.init()
      return json(await CrmBlog.create(input), 201)
    }
    if (route === "blogs/import" && method === "POST") {
      const posts = parseImport(await body(req))
      await CrmBlog.init()
      const existing = await CrmBlog.find({ slug: { $in: posts.map(p => p.slug) } }).select("slug").lean()
      if (existing.length) throw new HttpError(409, "One or more slugs already exist in your dashboard. Edit those blogs or change the JSON slugs.")
      // Each post is inserted separately; duplicate races are reported with the exact saved count.
      let imported = 0
      try {
        for (const post of posts) { await CrmBlog.create(post); imported++ }
      } catch {
        return json({ error: `Import stopped after ${imported} of ${posts.length} blogs. Refresh your list before retrying.`, imported }, 409)
      }
      return json({ imported }, 201)
    }
    if (path[0] === "blogs" && path.length === 2 && ["PATCH", "DELETE"].includes(method)) {
      if (!isValidObjectId(path[1])) throw new HttpError(400, "Invalid blog ID.")
      const filter = { _id: path[1] }
      const post = method === "DELETE" ? await CrmBlog.findOneAndDelete(filter) : await CrmBlog.findOneAndUpdate(filter, { $set: { ...blogInput.parse(await body(req)), modifiedAt: new Date().toISOString().slice(0, 10) } }, { new: true, runValidators: true })
      if (!post) throw new HttpError(404, "Blog not found.")
      return json({ ok: true })
    }
    throw new HttpError(404, "Endpoint not found.")
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status)
    if (error instanceof ZodError) return json({ error: error.issues.map(i => `${i.path.join(".") || "JSON"}: ${i.message}`).join("; ") }, 400)
    if (error instanceof Error && error.message === "The import contains duplicate slugs.") return json({ error: error.message }, 400)
    if ((error as { code?: number })?.code === 11000) return json({ error: "That email or blog slug already exists." }, 409)
    console.error("CRM request failed", error instanceof Error ? error.name : "Unknown error")
    return json({ error: "CRM is unavailable. Check the MongoDB connection and server configuration." }, 503)
  }
}
export { handle as GET, handle as POST, handle as PATCH, handle as DELETE }
