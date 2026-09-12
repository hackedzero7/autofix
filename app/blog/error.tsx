"use client"
export default function BlogError({ reset }: { reset: () => void }) {
  return <main className="mx-auto min-h-[60vh] max-w-3xl px-4 py-20 text-white"><h1 className="text-3xl font-bold">Articles are temporarily unavailable</h1><p className="my-5 text-zinc-300">We couldn't load the blog. Please try again.</p><button onClick={reset} className="rounded-lg bg-red-700 px-5 py-3 font-semibold hover:bg-red-600">Try again</button><a href="/" className="ml-6 text-zinc-300 underline">Return home</a></main>
}
