import type { MetadataRoute } from "next"
import { getPublishedBlogs } from "@/lib/public-blogs"
import { blogSitemap } from "@/lib/blog-seo"
export const dynamic = "force-dynamic"
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return blogSitemap(await getPublishedBlogs())
}
