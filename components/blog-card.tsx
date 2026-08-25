import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { BlogPost } from "@/data/blogs"

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group h-full rounded-2xl border border-border/20 bg-gradient-to-br from-[#0d0d0d] via-[#111111] to-[#1a1111] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_rgba(255,0,0,0.15)]">
      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-400">
          {post.category}
        </span>
        <time dateTime={post.publishedAt} className="text-xs text-zinc-400">
          {new Date(post.publishedAt).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}
        </time>
      </div>

      <h3 className="mb-3 text-2xl font-serif font-bold leading-tight text-white">
        {post.title}
      </h3>

      <p className="mb-5 text-base leading-relaxed text-zinc-300">{post.excerpt}</p>

      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
        <span>{post.author}</span>
        <span>•</span>
        <span>{post.readingTime}</span>
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center gap-2 font-semibold text-primary transition-colors duration-200 hover:text-red-400"
      >
        Read More
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
