import type { Metadata } from "next"
import Link from "next/link"
import styles from "./theme.module.css"

export const metadata: Metadata = { title: "Blog CRM", robots: { index: false, follow: false } }
export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${styles.theme} min-h-screen bg-background text-foreground`}><header className="border-b border-border"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5"><Link href="/crm" className="text-xl font-bold">CBR <span className="text-red-300">Blog CRM</span></Link><Link href="/" className="text-sm text-muted-foreground">Return to website</Link></div></header>{children}</div>
}
