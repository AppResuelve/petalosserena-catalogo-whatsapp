// @ts-nocheck
'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { servicesService } from '@/services/storeService'
import { formatPrice } from '@/utils/formatPrice'
import { content } from '@/data/siteData'

function PetalDeco({ className = "", style = {} }) {
  return (
    <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path d="M30 75 C10 60 0 40 5 20 C10 5 20 0 30 0 C40 0 50 5 55 20 C60 40 50 60 30 75Z" fill="currentColor" />
    </svg>
  )
}

function ThinLine({ className = "", style = {} }) {
  return <div className={`h-px ${className}`} style={{ backgroundColor: "var(--color-border)", ...style }} />
}

function ServiceCard({ service }) {
  const variants = service.variants || []
  const minPrice = variants.length > 0 ? Math.min(...variants.map(v => Number(v.price))) : Number(service.price) || 0
  const hasDuration = variants.some(v => v.durationMinutes)

  return (
    <Link
      href={`/servicios/${service.slug}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-card)" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 40px rgba(203,110,228,0.12)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {service.images && service.images[0] && (
        <div className="aspect-[16/10] overflow-hidden">
          <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-lg font-normal mb-2 group-hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          {service.name}
        </h3>
        {service.description && (
          <p className="text-sm line-clamp-2 mb-4 flex-1" style={{ color: "var(--color-text-secondary)" }}>{service.description}</p>
        )}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>{formatPrice(minPrice)}</span>
            {variants.length > 1 && <span className="text-xs ml-1" style={{ color: "var(--color-text-muted)" }}>desde</span>}
          </div>
          <div className="flex items-center gap-3">
            {hasDuration && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                <Clock className="w-3 h-3" />
                {Math.min(...variants.filter(v => v.durationMinutes).map(v => v.durationMinutes))} min
              </span>
            )}
            <span className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: "var(--color-primary)" }}>
              Ver <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    servicesService.list({ limit: 100 }).then(r => setServices(r.services)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--color-background)", paddingTop: "5rem", paddingBottom: "4rem" }}>
        <PetalDeco className="absolute top-6 right-[6%] text-[var(--color-lila)] hidden md:block" style={{ width: 120, opacity: 0.12 }} />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: "var(--color-accent)" }} />
            <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: "var(--color-accent)" }}>{content.services.badge}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: 400, lineHeight: 1.05, color: "var(--color-text-primary)", marginBottom: "0.75rem" }}>
            {content.services.title}
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "32rem" }}>
            {content.services.subtitle}
          </p>
          <div className="flex items-center gap-3 mt-5">
            <div className="h-px w-10" style={{ backgroundColor: "var(--color-border-hover)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-lila)", opacity: 0.7 }} />
            <div className="h-px w-24" style={{ backgroundColor: "var(--color-border-hover)" }} />
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-[var(--color-border)]" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-[var(--color-border)] rounded-full w-3/4" />
                    <div className="h-5 bg-[var(--color-border)] rounded-full w-1/4 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <PetalDeco className="text-[var(--color-lila)] mb-4" style={{ width: 100, opacity: 0.3 }} />
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{content.services.noResults}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
