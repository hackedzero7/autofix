"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Connection = {
  id: string
  clientName: string
  callbackOrigins: string[]
  scopes: string[]
  createdAt: string
  expiresAt: string
}

const permissions: Record<string, string> = {
  "blogs:read": "Read articles and drafts",
  "blogs:write": "Create, edit, and publish articles",
  "blogs:delete": "Delete articles",
}

async function request(method = "GET", grantId?: string) {
  const response = await fetch("/api/crm/connections", {
    method, cache: "no-store", headers: { "Content-Type": "application/json" },
    ...(grantId ? { body: JSON.stringify({ grantId }) } : {}),
  })
  const data = await response.json()
  if (response.status === 401) window.location.assign("/crm/login")
  if (!response.ok) throw new Error(data.error || "The request failed. Please try again.")
  return data
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export default function McpConnections({ user }: { user: { name: string; email: string } }) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState<Connection | null>(null)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const reload = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await request()
      setConnections(data.connections)
      setHasLoaded(true)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Connections are unavailable.")
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void reload() }, [reload])

  async function revoke(connection: Connection) {
    setBusy(true)
    setError("")
    setMessage("")
    try {
      await request("DELETE", connection.id)
      setConnections(current => current.filter(item => item.id !== connection.id))
      setMessage(`Access revoked for ${connection.clientName}.`)
      setPending(null)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "The connection could not be revoked.")
      setPending(null)
    } finally { setBusy(false) }
  }

  return <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-red-300">Administrator</p>
        <h1 className="mt-1 text-3xl font-bold">AI connections</h1>
        <p className="mt-2 break-words text-muted-foreground">Manage access authorized by {user.name} ({user.email}).</p>
      </div>
      <Button variant="outline" asChild><Link href="/crm/admin">Back to blogs</Link></Button>
    </header>

    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-7">
      <h2 className="text-lg font-semibold">Control your connected agents</h2>
      <p className="mt-2 text-sm text-muted-foreground">These connections can use the blog library with the permissions you approved. Revoking a connection blocks its access and refresh tokens on subsequent requests. It does not delete articles.</p>
      <p className="mt-2 text-sm text-muted-foreground">Authorizations expire after 30 days. The agent must reconnect and obtain your consent to continue after expiry. Connections authorized by other administrators are managed by those administrators.</p>
    </section>

    {error && <p role="alert" className="break-words rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">{error}</p>}
    {message && <p role="status" className="break-words rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-green-300">{message}</p>}

    <section aria-labelledby="active-connections" aria-busy={loading || busy} className="rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="active-connections" className="text-xl font-semibold">Active connections</h2>
        <Button variant="outline" disabled={loading || busy} onClick={() => { setMessage(""); void reload() }}>{loading ? "Refreshing..." : "Refresh"}</Button>
      </div>
      {loading ? <p role="status" className="py-6 text-muted-foreground">Loading your connections...</p>
        : !hasLoaded ? <p className="py-6 text-muted-foreground">Unable to load connections. Use Refresh to try again.</p>
        : !connections.length ? <p className="py-6 text-muted-foreground">You have no active AI connections. New connections appear here after you sign in and approve access from an MCP client.</p>
        : <ul className="mt-3 divide-y divide-border">{connections.map(connection => <li key={connection.id} className="space-y-4 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 break-words text-lg font-semibold">{connection.clientName}</h3>
            <Button variant="destructive" disabled={busy || loading} aria-label={`Revoke access for ${connection.clientName}`} onClick={() => setPending(connection)}>Revoke access</Button>
          </div>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-muted-foreground">Authorized</dt><dd className="mt-1"><time dateTime={connection.createdAt}>{dateLabel(connection.createdAt)}</time></dd></div>
            <div><dt className="text-muted-foreground">Expires</dt><dd className="mt-1"><time dateTime={connection.expiresAt}>{dateLabel(connection.expiresAt)}</time></dd></div>
            <div><dt className="text-muted-foreground">Permissions</dt><dd className="mt-1"><ul className="list-disc space-y-1 pl-5">{connection.scopes.map(scope => <li key={scope}>{permissions[scope] || scope}</li>)}</ul></dd></div>
            <div><dt className="text-muted-foreground">Client callback addresses</dt><dd className="mt-1 space-y-1 break-all">{connection.callbackOrigins.map(origin => <p key={origin}>{origin}</p>)}</dd></div>
          </dl>
        </li>)}</ul>}
    </section>

    <AlertDialog open={!!pending} onOpenChange={open => { if (!open && !busy) setPending(null) }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke this connection?</AlertDialogTitle>
          <AlertDialogDescription className="break-words">{pending?.clientName} will lose its access to your blog library. Scheduled work using this connection will stop. Connecting again requires your consent.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={busy} className="bg-destructive text-white hover:bg-destructive/90" onClick={event => { event.preventDefault(); if (pending) void revoke(pending) }}>{busy ? "Revoking..." : "Revoke access"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </main>
}
