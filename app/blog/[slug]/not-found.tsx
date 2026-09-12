import Link from "next/link"
export default function BlogNotFound() {
  return <main className="mx-auto min-h-[60vh] max-w-3xl px-4 py-20 text-white"><h1 className="text-3xl font-bold">Article not found</h1><p className="my-5 text-zinc-300">This article is unavailable or has not been published.</p><Link href="/blog" className="text-red-300 underline">Browse published articles</Link></main>
}
