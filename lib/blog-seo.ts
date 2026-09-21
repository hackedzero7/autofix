import type { Metadata, MetadataRoute } from "next"
import type { BlogPost } from "./blog-types"

export function normalizeSiteUrl(value: string): string {
  const url = new URL(value)
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/') {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path or credentials')
  }
  return url.origin
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.proautocare.co')
export const siteName = 'Pro Auto Care'
export const socialImage = `${siteUrl}/black-sports-car-red-lighting.png`
export const articleUrl = (post: BlogPost) => `${siteUrl}/blog/${post.slug}`

export function articleMetadata(post: BlogPost): Metadata {
  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt
  return {
    title, description, alternates: { canonical: articleUrl(post) },
    keywords: post.keywords, authors: [{ name: post.author }], category: post.category,
    robots: { index: !post.noIndex, follow: true, googleBot: { index: !post.noIndex, follow: true, 'max-image-preview': 'large' } },
    openGraph: {
      title, description, url: articleUrl(post), type: 'article', siteName, locale: 'en_AE',
      publishedTime: post.publishedAt, modifiedTime: post.modifiedAt,
      authors: [post.author], section: post.category, tags: post.keywords,
      images: [{ url: socialImage, alt: 'Pro Auto Care' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [socialImage] },
  }
}

export function articleStructuredData(post: BlogPost) {
  return {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title, description: post.excerpt, url: articleUrl(post),
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl(post) },
    datePublished: post.publishedAt, dateModified: post.modifiedAt || post.publishedAt,
    // Team authors can explicitly identify themselves through authorType.
    author: { '@type': post.authorType || (post.author === siteName ? 'Organization' : 'Person'), name: post.author },
    publisher: { '@type': 'Organization', name: siteName, url: siteUrl },
    articleSection: post.category, keywords: post.keywords.join(', '), inLanguage: 'en-AE',
  }
}

export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')

export function relatedArticles(post: BlogPost, candidates: BlogPost[], limit = 2) {
  const keywords = new Set(post.keywords.map(word => word.toLowerCase().trim()))
  return candidates.filter(candidate => candidate.slug !== post.slug && !candidate.noIndex)
    .map(candidate => ({ candidate, score:
      (candidate.category.toLowerCase() === post.category.toLowerCase() ? 2 : 0) +
      candidate.keywords.filter(word => keywords.has(word.toLowerCase().trim())).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.slug.localeCompare(b.candidate.slug))
    .slice(0, limit).map(({ candidate }) => candidate)
}

export function blogSitemap(posts: BlogPost[]): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/` }, { url: `${siteUrl}/blog` },
    ...Array.from(new Map(posts.filter(post => !post.noIndex).map(post => [post.slug, {
      url: articleUrl(post), lastModified: post.modifiedAt || post.publishedAt,
    }])).values()),
  ]
}
