import Header from "@/components/header"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { BlogCardsSkeleton } from "@/components/blog-cards-skeleton"

export default function BlogSkeleton({ detail = false }: { detail?: boolean }) {
  return <div className="min-h-screen bg-background text-foreground"><Header />
    <main aria-busy="true" className={"mx-auto space-y-10 px-4 py-16 " + (detail ? "max-w-4xl" : "max-w-7xl")}>
      <div aria-hidden="true" className="space-y-5">
        <Skeleton className="h-6 w-36 bg-zinc-700 motion-reduce:animate-none" />
        <Skeleton className="h-12 w-full max-w-3xl bg-zinc-800 motion-reduce:animate-none" />
        <Skeleton className="h-12 w-2/3 bg-zinc-800 motion-reduce:animate-none" />
        <Skeleton className="h-5 w-1/2 bg-zinc-800 motion-reduce:animate-none" />
      </div>
      {detail ? <div role="status" aria-label="Loading article" className="space-y-8 rounded-2xl border border-white/15 bg-zinc-900 p-6">
        <span className="sr-only">Loading article...</span>
        {Array.from({ length: 3 }, (_, i) => <div key={i} aria-hidden="true" className="space-y-4">
          <Skeleton className="h-8 w-2/3 bg-zinc-700 motion-reduce:animate-none" />
          {Array.from({ length: 4 }, (_, j) => <Skeleton key={j} className="h-4 w-full bg-zinc-800 motion-reduce:animate-none" />)}
        </div>)}
      </div> : <BlogCardsSkeleton />}
    </main><Footer /></div>
}
