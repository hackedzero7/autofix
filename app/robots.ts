import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"],
    },
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
    host: siteUrl,
  }
}
