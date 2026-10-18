import mongoose, { Schema } from "mongoose"

const clientSchema = new Schema({
  clientId: { type: String, unique: true, required: true }, name: { type: String, required: true },
  redirectUris: { type: [String], required: true }, scopes: { type: [String], required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true })
const consentSchema = new Schema({
  tokenHash: { type: String, unique: true, required: true }, csrfHash: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true }, clientId: { type: String, required: true },
  redirectUri: { type: String, required: true }, resource: { type: String, required: true }, scopes: [String],
  codeChallenge: { type: String, required: true }, state: String,
  expiresAt: { type: Date, expires: 0, required: true },
})
const grantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true }, clientId: { type: String, required: true, index: true },
  resource: { type: String, required: true }, scopes: [String], revokedAt: Date,
  expiresAt: { type: Date, expires: 0, required: true },
}, { timestamps: true })
const codeSchema = new Schema({
  tokenHash: { type: String, unique: true, required: true }, grantId: { type: Schema.Types.ObjectId, required: true },
  clientId: { type: String, required: true }, redirectUri: { type: String, required: true },
  resource: { type: String, required: true }, codeChallenge: { type: String, required: true },
  consumedAt: Date,
  expiresAt: { type: Date, expires: 0, required: true },
})
const tokenSchema = new Schema({
  tokenHash: { type: String, unique: true, required: true }, type: { type: String, enum: ["access", "refresh"], required: true },
  grantId: { type: Schema.Types.ObjectId, required: true, index: true }, clientId: { type: String, required: true },
  scopes: { type: [String], required: true },
  consumedAt: Date, expiresAt: { type: Date, expires: 0, required: true },
})
const rateSchema = new Schema({ key: { type: String, unique: true, required: true }, count: { type: Number, default: 0 }, expiresAt: { type: Date, expires: 0, required: true } })
export const McpOAuthClient = mongoose.models.McpOAuthClient || mongoose.model("McpOAuthClient", clientSchema)
export const McpOAuthConsent = mongoose.models.McpOAuthConsent || mongoose.model("McpOAuthConsent", consentSchema)
export const McpOAuthGrant = mongoose.models.McpOAuthGrant || mongoose.model("McpOAuthGrant", grantSchema)
export const McpOAuthCode = mongoose.models.McpOAuthCode || mongoose.model("McpOAuthCode", codeSchema)
export const McpOAuthToken = mongoose.models.McpOAuthToken || mongoose.model("McpOAuthToken", tokenSchema)
export const McpOAuthRate = mongoose.models.McpOAuthRate || mongoose.model("McpOAuthRate", rateSchema)
