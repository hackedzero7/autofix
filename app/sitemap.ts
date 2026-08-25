import type { MetadataRoute } from "next"

import { blogs } from "@/data/blogs"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co"

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl.replace(/\/$/, "")

  const blogEntries = blogs.map((blog) => ({
    url: `${url}/blog/${blog.slug}`,
    lastModified: new Date(blog.publishedAt),
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
