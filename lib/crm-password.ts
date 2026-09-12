import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(scryptCallback)
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = await scrypt(password, salt, 64) as Buffer
  return `${salt}:${hash.toString("hex")}`
}
export async function verifyPassword(password: string, stored: string) {
  const [salt, encoded] = stored.split(":")
  if (!/^[a-f0-9]{32}$/.test(salt || "") || !/^[a-f0-9]{128}$/.test(encoded || "")) return false
  const actual = await scrypt(password, salt, 64) as Buffer
  const expected = Buffer.from(encoded, "hex")
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
