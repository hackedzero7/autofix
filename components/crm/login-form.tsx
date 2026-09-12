"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
export default function LoginForm() {
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  return <main className="mx-auto max-w-md px-4 py-16"><h1 className="text-3xl font-bold">Admin sign in</h1><p className="mt-3 mb-8 text-muted-foreground">Sign in to upload and manage your blogs. Administrator access only.</p><form className="space-y-5" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setError("")
    const form = new FormData(e.currentTarget)
    try {
      const response = await fetch("/api/crm/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      window.location.assign(data.redirect)
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in."); setBusy(false) }
  }}><label className="block space-y-2"><span>Email</span><Input name="email" type="email" autoComplete="username" required /></label><label className="block space-y-2"><span>Password</span><Input name="password" type="password" autoComplete="current-password" required maxLength={128} /></label>{error && <p role="alert" className="text-red-400">{error}</p>}<Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button></form></main>
}
