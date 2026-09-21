import { readFileSync } from 'node:fs'

const blogRedirects = JSON.parse(readFileSync(new URL('./data/blog-redirects.json', import.meta.url), 'utf8'))
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
for (const [oldSlug, newSlug] of Object.entries(blogRedirects)) {
  if (!slugPattern.test(oldSlug) || typeof newSlug !== 'string' || !slugPattern.test(newSlug) || oldSlug === newSlug || blogRedirects[newSlug]) {
    throw new Error('Blog redirects must map old slugs directly to current slugs without chains or cycles')
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Resolve metadata and notFound before streaming HTTP headers.
  htmlLimitedBots: /.*/,
  trailingSlash: false,
  async redirects() {
    return Object.entries(blogRedirects).map(([from, to]) => ({
      source: `/blog/${from}`, destination: `/blog/${to}`, permanent: true,
    }))
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
