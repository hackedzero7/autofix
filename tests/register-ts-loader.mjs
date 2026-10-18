import { registerHooks } from "node:module"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

// Resolve Next.js extensionless relative TS imports for Node's type stripping.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/headers") return nextResolve("next/headers.js", context)
    if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      const url = new URL(specifier, context.parentURL)
      if (!/\.[a-z]+$/i.test(url.pathname)) {
        const candidate = new URL(`${url.href}.ts`)
        if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context)
      }
    }
    return nextResolve(specifier, context)
  },
})
