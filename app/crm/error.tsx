"use client"
export default function CrmError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-bold">CRM unavailable</h1><p className="my-4">Please check the MongoDB connection and try again.</p><button onClick={reset} className="rounded bg-primary px-4 py-2">Try again</button></main>
}
