import type { MetadataRoute } from "next"

import { getPublishedBlogs } from "@/lib/public-blogs"

export const dynamic = "force-dynamic"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getPublishedBlogs()
  const url = siteUrl.replace(/\/$/, "")

  const blogEntries = blogs.map((blog) => ({
    url: `${url}/blog/${blog.slug}`,
    lastModified: new Date(blog.modifiedAt || blog.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: `${url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogEntries,
  ]
}
