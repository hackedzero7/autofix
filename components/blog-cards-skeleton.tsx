import { Skeleton } from "@/components/ui/skeleton"
export function BlogCardsSkeleton({ count = 6 }: { count?: number }) {
  return <div role="status" aria-label="Loading blogs" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    <span className="sr-only">Loading blogs...</span>
    {Array.from({ length: count }, (_, i) => <div key={i} aria-hidden="true" className="space-y-5 rounded-2xl border border-white/15 bg-zinc-900 p-6">
      <Skeleton className="h-5 w-24 bg-zinc-700 motion-reduce:animate-none" />
      <Skeleton className="h-8 w-full bg-zinc-800 motion-reduce:animate-none" />
      <Skeleton className="h-8 w-3/4 bg-zinc-800 motion-reduce:animate-none" />
      <Skeleton className="h-4 w-full bg-zinc-800 motion-reduce:animate-none" />
      <Skeleton className="h-4 w-5/6 bg-zinc-800 motion-reduce:animate-none" />
      <Skeleton className="h-5 w-28 bg-zinc-700 motion-reduce:animate-none" />
    </div>)}
  </div>
}
