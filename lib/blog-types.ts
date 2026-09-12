export type BlogSection = { heading?: string; paragraphs?: string[]; list?: string[]; quote?: string }
export type BlogPost = {
  id: number | string
  title: string
  slug: string
  excerpt: string
  category: string
  publishedAt: string
  modifiedAt?: string
  author: string
  readingTime: string
  keywords: string[]
  content: BlogSection[]
}
