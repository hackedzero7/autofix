import { loadEnvConfig } from "@next/env"
import mongoose from "mongoose"
import { randomBytes, scrypt as scryptCallback } from "node:crypto"
import { promisify } from "node:util"

loadEnvConfig(process.cwd())
const { MONGODB_URI, CRM_ADMIN_EMAIL, CRM_ADMIN_PASSWORD, CRM_ADMIN_NAME = "Administrator" } = process.env
if (!MONGODB_URI || !CRM_ADMIN_EMAIL || !CRM_ADMIN_PASSWORD || CRM_ADMIN_PASSWORD.length < 12 || CRM_ADMIN_PASSWORD.length > 128 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CRM_ADMIN_EMAIL)) {
  console.error("Set MONGODB_URI, CRM_ADMIN_EMAIL, and CRM_ADMIN_PASSWORD (12–128 characters) in .env.local before running this command.")
  process.exit(1)
}
try {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  const users = mongoose.connection.collection("crmusers")
  await users.createIndex({ email: 1 }, { unique: true })
  const email = CRM_ADMIN_EMAIL.trim().toLowerCase()
  if (await users.findOne({ email })) throw new Error("An account with this email already exists. Existing credentials were not changed.")
  const salt = randomBytes(16).toString("hex")
  const hash = await promisify(scryptCallback)(CRM_ADMIN_PASSWORD, salt, 64)
  await users.insertOne({ name: CRM_ADMIN_NAME, email, passwordHash: `${salt}:${hash.toString("hex")}`, role: "admin", active: true, createdAt: new Date(), updatedAt: new Date() })
  console.log("Administrator created. Sign in at /crm/login.")
} catch (error) {
  console.error(error.message.includes("already exists") ? error.message : "Could not create administrator. Check your MongoDB connection and configuration.")
  process.exitCode = 1
} finally { await mongoose.disconnect() }
