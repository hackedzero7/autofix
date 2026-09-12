import test from "node:test"
import assert from "node:assert/strict"

// Run against a local dev server: CRM_TEST_URL=http://localhost:3001 node --test tests/crm-http.test.mjs
const base = process.env.CRM_TEST_URL || "http://localhost:3001"
test("unauthenticated blog APIs return 401 without exposing data", async () => {
  for (const path of ["blogs"]) {
    const response = await fetch(`${base}/api/crm/${path}`)
    assert.equal(response.status, 401)
    assert.match((await response.json()).error, /log in/)
    assert.equal(response.headers.get("cache-control"), "no-store")
  }
})
test("cross-origin mutations are rejected before processing credentials", async () => {
  const response = await fetch(`${base}/api/crm/login`, { method: "POST", headers: { Origin: "https://untrusted.example", "Content-Type": "application/json" }, body: "{}" })
  assert.equal(response.status, 403)
})
test("malformed JSON and invalid login fields return actionable validation errors", async () => {
  for (const body of ["{", JSON.stringify({ email: "invalid", password: "" })]) {
    const response = await fetch(`${base}/api/crm/login`, { method: "POST", headers: { Origin: base, "Content-Type": "application/json" }, body })
    assert.equal(response.status, 400)
    assert.ok((await response.json()).error)
  }
})
test("private dashboard routes redirect to login", async () => {
  for (const path of ["admin"]) {
    const response = await fetch(`${base}/crm/${path}`, { redirect: "manual" })
    assert.equal(response.status, 307)
    assert.equal(response.headers.get("location"), "/crm/login")
  }
})
test("login page renders with noindex metadata", async () => {
  const response = await fetch(`${base}/crm/login`)
  assert.equal(response.status, 200)
  const html = await response.text()
  assert.match(html, /Admin sign in/)
  assert.match(html, /noindex/)
})

test("bulk deletion rejects anonymous and cross-origin requests", async () => {
  for (const [origin, expected] of [[base, 401], ["https://untrusted.example", 403]]) {
    const response = await fetch(base + "/api/crm/blogs", { method: "DELETE", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: "DELETE_ALL_BLOGS" }) })
    assert.equal(response.status, expected)
  }
})
