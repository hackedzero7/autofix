import { cache } from "react"
import { connectDB } from "./mongodb"
import { CrmBlog } from "./crm-models"
import { blogInput } from "./crm-validation"
import type { BlogPost } from "./blog-types"

function toPublicPost(document: Record<string, unknown>): BlogPost {
  const { status, ...post } = blogInput.parse(document)
  return { ...post, id: String(document._id) }
}

// Share reads with metadata within one request; never cache stale publications.
export const getPublishedBlogs = cache(async (): Promise<BlogPost[]> => {
  await connectDB()
  const posts = await CrmBlog.find({ status: "published" }).sort({ publishedAt: -1, _id: -1 }).lean<Record<string, unknown>[]>()
  return posts.map(post => toPublicPost(post))
})

export const getPublishedBlogBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180) return null
  await connectDB()
  const post = await CrmBlog.findOne({ slug, status: "published" }).lean<Record<string, unknown> | null>()
  return post ? toPublicPost(post) : null
})
