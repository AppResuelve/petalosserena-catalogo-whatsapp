import type { Metadata } from "next"
import { Cormorant_Garamond, Inter, DM_Sans } from "next/font/google"
import "./globals.css"
import { baseMetadata } from "@/lib/metadata"

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-admin',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = baseMetadata as Metadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`h-full antialiased ${cormorant.variable} ${inter.variable} ${dmSans.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
