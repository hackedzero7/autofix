import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display } from "next/font/google"
import { Source_Sans_3 as Source_Sans_Pro } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
})

const sourceSansPro = Source_Sans_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-sans",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co"
const siteName = "Pro Auto Care"
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  title: {
    default: "Pro Auto Care | Car Battery Replacement & Auto Service in Abu Dhabi",
    template: "%s | Pro Auto Care",
  },
  description:
    "Professional car battery replacement, AC repair, and mobile auto services in Abu Dhabi. Fast, reliable diagnostics, premium batteries, and 24/7 emergency support from Pro Auto Care.",
  keywords: [
    "Pro Auto Care Abu Dhabi",
    "car battery replacement Abu Dhabi",
    "automotive repair Abu Dhabi",
    "car AC repair UAE",
    "mobile car battery service",
    "emergency roadside assistance Abu Dhabi",
    "auto service near me",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pro Auto Care | Car Battery Replacement & Auto Service in Abu Dhabi",
    description:
      "Expert car battery replacement, AC repair, and automotive maintenance in Abu Dhabi, delivered with fast response times and trusted service.",
    url: "/",
    siteName,
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "/black-sports-car-red-lighting.png",
        width: 1200,
        height: 630,
        alt: "Pro Auto Care vehicle service and battery replacement in Abu Dhabi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Auto Care | Car Battery Replacement & Auto Service in Abu Dhabi",
    description:
      "Fast car battery replacement, AC repair, and roadside support for drivers in Abu Dhabi.",
    images: ["/black-sports-car-red-lighting.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/placeholder-logo.svg", type: "image/svg+xml" }],
    shortcut: "/placeholder-logo.svg",
    apple: "/placeholder-logo.svg",
  },
  other: {
    "theme-color": "#111111",
    "color-scheme": "dark",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSansPro.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
