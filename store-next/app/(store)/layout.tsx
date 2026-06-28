'use client'

import { Suspense } from "react"
import { StoreProvider, useStore } from "@/context/StoreContext"
import { CartProvider } from "@/context/CartContext"
import { Navbar } from "@/components/store/Navbar"
import { Footer } from "@/components/store/Footer"
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton"
import { ScrollToTop } from "@/components/ScrollToTop"
import { StoreBlocked } from "@/components/store/StoreBlocked"

function StoreInner({ children }: { children: React.ReactNode }) {
  const { store, loading } = useStore()
  const status = store?.store_status || "active"

  if (loading) return null
  if (status !== "active") return <StoreBlocked status={status} />

  return (
    <CartProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Suspense fallback={<div className="h-16" />}>
          <Navbar heroMode={false} />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer waveFromColor="#ffffff" />
      </div>
      <FloatingWhatsAppButton />
    </CartProvider>
  )
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <StoreInner>{children}</StoreInner>
    </StoreProvider>
  )
}
