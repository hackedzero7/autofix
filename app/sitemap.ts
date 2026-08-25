import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co"

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl.replace(/\/$/, "")

  return [
    {
      url: `${url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}
