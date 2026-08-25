import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { blogs, getBlogBySlug } from "@/data/blogs"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co"

export function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: {
      canonical: `${siteUrl}/blog/${blog.slug}`,
    },
    keywords: blog.keywords,
    authors: [{ name: blog.author }],
    category: blog.category,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      url: `${siteUrl}/blog/${blog.slug}`,
      locale: "en_AE",
      siteName: "Pro Auto Care",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.publishedAt,
      authors: [blog.author],
      tags: blog.keywords,
      images: [{ url: "/black-sports-car-red-lighting.png", width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: ["/black-sports-car-red-lighting.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const relatedPosts = blogs.filter((post) => post.slug !== blog.slug).slice(0, 2)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    author: {
      "@type": "Organization",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Pro Auto Care",
      logo: {
        "@type": "ImageObject",
        url: "https://www.proautocare.co/placeholder-logo.svg",
      },
    },
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    mainEntityOfPage: `https://www.proautocare.co/blog/${blog.slug}`,
    articleSection: blog.category,
    keywords: blog.keywords.join(", "),
    inLanguage: "en-AE",
  }

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="min-h-screen bg-background text-foreground">
        <article className="mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-2xl border border-border/20 bg-gradient-to-br from-[#111111] via-[#0d0d0d] to-[#1c0d0d] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.25)] sm:p-8">
            <Link href="/blog" className="mb-6 inline-flex text-sm font-semibold text-primary hover:text-red-400">
              ← Back to blog
            </Link>
            <p className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">
              {blog.category}
            </p>
            <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">{blog.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span>{blog.author}</span>
              <span>•</span>
              <time dateTime={blog.publishedAt}>
                {new Date(blog.publishedAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
              </time>
              <span>•</span>
              <span>{blog.readingTime}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-border/15 bg-gradient-to-br from-[#111111] via-[#0d0d0d] to-[#1b1111] p-6 shadow-[0_14px_35px_rgba(0,0,0,0.22)] sm:p-8">
            <div className="prose prose-invert max-w-none">
              {blog.content.map((section, index) => (
                <section key={index} className="mb-10">
                  {section.heading && (
                    <h2 className="mb-5 font-serif text-3xl font-bold text-white">{section.heading}</h2>
                  )}

                  {section.paragraphs?.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="mb-5 text-lg leading-8 text-zinc-300">
                      {paragraph}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="mb-6 list-disc space-y-3 pl-6 text-lg leading-8 text-zinc-300">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.quote && (
                    <blockquote className="my-8 border-l-2 border-primary bg-[#1a0d0d] p-6 text-xl italic text-white shadow-inner">
                      “{section.quote}”
                    </blockquote>
                  )}
                </section>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-border/20 bg-gradient-to-r from-[#1a1111] via-[#141414] to-[#1a1111] p-6 shadow-[0_12px_30px_rgba(255,0,0,0.08)]">
            <h3 className="mb-4 font-serif text-2xl font-bold text-white">Need help with your vehicle?</h3>
            <p className="mb-6 text-base leading-7 text-zinc-300">
              If your battery, AC, or vehicle system needs expert attention, Pro Auto Care can help with fast, reliable service in Abu Dhabi.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+971567304650" className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors hover:bg-red-500">
                Call Now
              </a>
              <Link href="/" className="rounded-xl border border-border/30 px-5 py-3 font-semibold text-white transition-colors hover:border-primary hover:text-primary">
                Back to Home
              </Link>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h3 className="mb-8 font-serif text-3xl font-bold text-white">Related articles</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-border/20 bg-gradient-to-br from-[#131313] to-[#1a1111] p-6 transition-colors hover:border-primary/40 hover:shadow-[0_12px_30px_rgba(255,0,0,0.08)]">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-red-400">{post.category}</p>
                    <h4 className="mb-3 text-2xl font-serif font-bold text-white">{post.title}</h4>
                    <p className="text-zinc-300">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </>
  )
}
