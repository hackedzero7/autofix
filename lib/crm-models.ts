import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
  active: { type: Boolean, default: true },
}, { timestamps: true })
const sessionSchema = new Schema({
  tokenHash: { type: String, unique: true, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "CrmUser", required: true },
  expiresAt: { type: Date, expires: 0, required: true },
})
const sectionSchema = new Schema({ heading: String, paragraphs: [String], list: [String], quote: String }, { _id: false })
const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String, category: String, author: String, readingTime: String,
  publishedAt: String, modifiedAt: String, keywords: [String], content: [sectionSchema],
  status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true })
const attemptSchema = new Schema({
  key: { type: String, unique: true }, count: Number,
  expiresAt: { type: Date, expires: 0 },
})

export const CrmUser = mongoose.models.CrmUser || mongoose.model("CrmUser", userSchema)
export const CrmSession = mongoose.models.CrmSession || mongoose.model("CrmSession", sessionSchema)
export const CrmBlog = mongoose.models.CrmBlog || mongoose.model("CrmBlog", blogSchema)
export const LoginAttempt = mongoose.models.LoginAttempt || mongoose.model("LoginAttempt", attemptSchema)
