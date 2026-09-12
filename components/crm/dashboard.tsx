"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { BlogCardsSkeleton } from "@/components/blog-cards-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { blogInput, parseImport } from "@/lib/crm-validation"
import type { z } from "zod"

type Post = z.infer<typeof blogInput> & { _id?: string }
const blank = (): Post => ({ title: "", slug: "", excerpt: "", category: "", author: "", readingTime: "5 min read", publishedAt: new Date().toISOString().slice(0, 10), keywords: [], content: [{ paragraphs: [""] }], status: "draft" })
const example = { ...blank(), title: "Your first blog", slug: "your-first-blog", excerpt: "A short introduction to your article.", category: "Advice", author: "Your name", content: [{ heading: "Introduction", paragraphs: ["Write your article here."] }] }
async function api(path: string, method = "GET", body?: unknown) {
  const response = await fetch(`/api/crm/${path}`, { method, headers: { "Content-Type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
  const data = await response.json()
  if (response.status === 401) window.location.assign("/crm/login")
  if (!response.ok) throw new Error(data.error || "Request failed.")
  return data
}
function download(value: unknown, filename: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }))
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url)
}
export default function Dashboard({ user }: { user: { name: string } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [editor, setEditor] = useState<Post | null>(null)
  const [sections, setSections] = useState("")
  const [keywords, setKeywords] = useState("")
  const [raw, setRaw] = useState("")
  const [preview, setPreview] = useState<Post[]>([])
  const reload = useCallback(async () => {
    setPosts(await api("blogs"))
  }, [])
  useEffect(() => { reload().catch(e => setError(e.message)).finally(() => setLoading(false)) }, [reload])
  async function run(action: () => Promise<void>) {
    setBusy(true); setError(""); setMessage("")
    try { await action() } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong.") } finally { setBusy(false) }
  }
  function edit(post: Post) { setEditor(post); setSections(JSON.stringify(post.content, null, 2)); setKeywords(post.keywords.join(", ")) }
  const filtered = posts.filter(p => `${p.title} ${p.category} ${p.status}`.toLowerCase().includes(search.toLowerCase()))
  const panel = "rounded-2xl border border-border bg-card text-card-foreground p-5 sm:p-7"
  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-red-300">Administrator</p><h1 className="mt-1 text-3xl font-bold">Welcome, {user.name}</h1><p className="mt-2 text-muted-foreground">Manage the admin blog library. Published blogs appear on the public website. Drafts stay private.</p></div><Button variant="outline" disabled={busy} onClick={() => run(async () => { await api("logout", "POST"); window.location.assign("/crm/login") })}>Sign out</Button></div>
    {error && <div role="alert" className="break-words rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">{error}</div>}
    {message && <p role="status" className="rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-green-300">{message}</p>}
    <div className="grid grid-cols-3 gap-3">{[["Total blogs", posts.length], ["Drafts", posts.filter(p => p.status === "draft").length], ["Published", posts.filter(p => p.status === "published").length]].map(([label, count]) => <div key={label} className={panel}><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold">{count}</p></div>)}</div>
    <section className={panel}><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold">Your blogs</h2><div className="flex gap-2"><Button variant="outline" disabled={!posts.length || busy} onClick={() => download(posts.map(p => blogInput.parse(p)), "blogs.json")}>Export JSON</Button><Button disabled={busy} onClick={() => edit(blank())}>New blog</Button></div></div><Input className="my-5" aria-label="Search blogs" placeholder="Search title, category, or status…" value={search} onChange={e => setSearch(e.target.value)} />
      {loading ? <BlogCardsSkeleton count={3} /> : !filtered.length ? <p className="py-6 text-muted-foreground">{posts.length ? "No matching blogs." : "Your library is empty. Create a blog or import JSON below."}</p> : <div className="divide-y divide-border">{filtered.map(p => <article key={p._id} className="flex flex-wrap items-center justify-between gap-4 py-5"><div className="min-w-0 flex-1"><p className="text-xs uppercase text-red-300">{p.category} · {p.status}</p><h3 className="mt-1 break-words text-lg font-semibold">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.author} · {p.publishedAt}</p></div><div className="flex flex-wrap gap-2">{p.status === "published" && <Button variant="outline" asChild><Link href={"/blog/" + p.slug} target="_blank" rel="noopener noreferrer">View live</Link></Button>}<Button variant="outline" disabled={busy} onClick={() => edit(p)}>Edit</Button><Button variant="outline" className="border-red-400/40 text-red-300 hover:bg-red-500/15 hover:text-red-200" disabled={busy} onClick={() => { if (window.confirm(`Delete "${p.title}"? This cannot be undone.`)) void run(async () => { await api(`blogs/${p._id}`, "DELETE"); await reload(); setMessage("Blog deleted.") }) }}>Delete</Button></div></article>)}</div>}
    </section>
    {editor && <section className={panel}><h2 className="mb-5 text-xl font-semibold">{editor._id ? "Edit blog" : "Create blog"}</h2><form className="space-y-5" onSubmit={e => { e.preventDefault(); void run(async () => { let content; try { content = JSON.parse(sections) } catch { throw new Error("Content sections must be valid JSON.") } const input = blogInput.parse({ ...editor, keywords: keywords.split(",").map(s => s.trim()).filter(Boolean), content }); await api(editor._id ? `blogs/${editor._id}` : "blogs", editor._id ? "PATCH" : "POST", input); setEditor(null); await reload(); setMessage("Blog saved.") }) }}><div className="grid gap-4 sm:grid-cols-2">{(["title", "slug", "category", "author", "readingTime", "publishedAt"] as const).map(key => <label key={key} className="space-y-2"><span>{({ title: "Title", slug: "Slug", category: "Category", author: "Author", readingTime: "Reading time", publishedAt: "Publication date" })[key]}</span><Input required type={key === "publishedAt" ? "date" : "text"} value={editor[key]} onChange={e => setEditor({ ...editor, [key]: e.target.value })} /></label>)}</div><label className="block space-y-2"><span>Excerpt</span><Textarea required value={editor.excerpt} onChange={e => setEditor({ ...editor, excerpt: e.target.value })} /></label><label className="block space-y-2"><span>Keywords (comma separated)</span><Input value={keywords} onChange={e => setKeywords(e.target.value)} /></label><label className="block space-y-2"><span>Content sections (JSON)</span><p className="text-sm text-muted-foreground">Each section accepts heading, paragraphs, list, and quote. Text is displayed safely as plain text.</p><Textarea className="min-h-64 font-mono text-sm" required value={sections} onChange={e => setSections(e.target.value)} /></label><label className="block space-y-2"><span>Status</span><select className="block rounded border border-border bg-background p-3" value={editor.status} onChange={e => setEditor({ ...editor, status: e.target.value as Post["status"] })}><option value="draft">Draft</option><option value="published">Published on website</option></select></label><div className="flex gap-3"><Button disabled={busy}>Save blog</Button><Button type="button" variant="outline" disabled={busy} onClick={() => setEditor(null)}>Cancel</Button></div></form></section>}
    <section className={panel}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Import blogs from JSON</h2><Button variant="outline" onClick={() => download([example], "blog-import-example.json")}>Download example</Button></div><p className="mt-3 mb-5 text-sm text-muted-foreground">Upload or paste a blog, an array of blogs, or an object with a blogs array. Maximum 100 blogs and 2 MB. Existing slugs are rejected; imports never overwrite your blogs.</p><label className="block space-y-2"><span>JSON file</span><Input type="file" accept=".json,application/json" disabled={busy} onChange={async e => { const file = e.target.files?.[0]; setPreview([]); if (!file) return; if (file.size > 2 * 1024 * 1024) { setRaw(""); setError("File must be smaller than 2 MB."); return } try { setRaw(await file.text()); setError("") } catch { setError("Unable to read file.") } }} /></label><label className="mt-4 block space-y-2"><span>JSON data</span><Textarea className="min-h-48 font-mono text-sm" value={raw} onChange={e => { setRaw(e.target.value); setPreview([]) }} placeholder={'[{ "title": "Your blog", ... }]'} /></label><Button className="mt-4" variant="outline" disabled={busy || !raw.trim()} onClick={() => { setError(""); setMessage(""); setPreview([]); try { if (new Blob([raw]).size > 2 * 1024 * 1024) throw new Error("JSON must be smaller than 2 MB."); setPreview(parseImport(JSON.parse(raw))) } catch (e) { setError(e instanceof Error ? e.message : "Invalid JSON.") } }}>Validate and preview</Button>
      {!!preview.length && <div className="mt-5 rounded-lg border border-border p-4"><h3 className="font-semibold">Ready to import {preview.length} blogs</h3><ul className="my-4 max-h-60 list-disc overflow-auto pl-5 text-sm">{preview.map(p => <li key={p.slug}>{p.title} ({p.status})</li>)}</ul><Button disabled={busy} onClick={() => run(async () => { try { const result = await api("blogs/import", "POST", preview); setRaw(""); setPreview([]); setMessage(`Imported ${result.imported} blogs.`) } finally { await reload() } })}>{busy ? "Importing…" : "Import into my dashboard"}</Button></div>}
    </section>
  </main>
}
