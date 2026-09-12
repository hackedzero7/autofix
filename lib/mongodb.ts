import mongoose from "mongoose"

const globalCache = globalThis as typeof globalThis & { mongoConnection?: Promise<typeof mongoose> }

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("Set MONGODB_URI in .env.local to enable the CRM.")
  if (!globalCache.mongoConnection) {
    globalCache.mongoConnection = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 }).catch((error) => {
      globalCache.mongoConnection = undefined
      throw error
    })
  }
  return globalCache.mongoConnection
}
