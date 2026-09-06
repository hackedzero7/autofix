"use client"

import { useState } from "react"

import BlogCard from "@/components/blog-card"
import type { BlogPost } from "@/data/blogs"

const POSTS_PER_PAGE = 6

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)
  const visiblePosts = posts.slice(0, visibleCount)
  const hasMorePosts = visibleCount < posts.length

  return (
    <>
      <div className="col-span-full mb-1 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing <span className="font-semibold text-white">{visiblePosts.length}</span> of{" "}
          <span className="font-semibold text-white">{posts.length}</span> articles
        </span>
      </div>

      {visiblePosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}

      {hasMorePosts && (
        <div className="col-span-full flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + POSTS_PER_PAGE, posts.length))}
            className="rounded-xl border border-primary/50 bg-primary/10 px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Load More Articles
          </button>
        </div>
      )}
    </>
  )
}
