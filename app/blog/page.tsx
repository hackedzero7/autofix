import Link from "next/link"
import type { Metadata } from "next"

import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogList from "@/components/blog-list"
import { blogs } from "@/data/blogs"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co"

export const metadata: Metadata = {
  title: "Auto Service Advice Blog | Pro Auto Care",
  description:
    "Read practical car battery, AC repair, and maintenance advice for drivers in Abu Dhabi and the UAE from Pro Auto Care.",
  keywords: [
    "car battery blog Abu Dhabi",
    "auto service advice UAE",
    "car AC repair tips",
    "vehicle maintenance blog",
    "Pro Auto Care blog",
  ],
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "Auto Service Advice Blog | Pro Auto Care",
    description:
      "Expert advice on battery replacement, AC repair, and car maintenance for drivers in Abu Dhabi and across the UAE.",
    url: `${siteUrl}/blog`,
    siteName: "Pro Auto Care",
    locale: "en_AE",
    type: "website",
    images: [{ url: "/black-sports-car-red-lighting.png", width: 1200, height: 630, alt: "Pro Auto Care blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Service Advice Blog | Pro Auto Care",
    description:
      "Practical car battery, AC repair, and vehicle care insights from Pro Auto Care in Abu Dhabi.",
    images: ["/black-sports-car-red-lighting.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="bg-background text-foreground">
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              Pro Auto Care Blog
            </p>
            <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Automotive tips and service advice for drivers in Abu Dhabi
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Practical guidance on battery health, AC repair, vehicle maintenance, and roadside support to keep your car reliable in the UAE climate.
            </p>
          </div>

          <div className="mb-10 flex items-center justify-between border-b border-border/20 pb-4">
            <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
              Total Articles: <span className="font-bold text-white">{blogs.length}</span>
            </p>
            <Link href="/" className="text-sm font-semibold text-primary hover:text-red-400">
              Return home
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            <BlogList posts={blogs} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
