// @ts-nocheck
'use client'
// @ts-nocheck
import { useState, useEffect, useMemo } from 'react'
import { useParams } from "next/navigation"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Clock } from 'lucide-react'
import { content } from '@/data/siteData'
import { servicesService } from '@/services/storeService'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/formatPrice'
import { QuantitySelector } from '@/components/store/QuantitySelector'

function PetalDeco({ className = "", style = {} }) {
  return (
    <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden="true">
      <path d="M30 75 C10 60 0 40 5 20 C10 5 20 0 30 0 C40 0 50 5 55 20 C60 40 50 60 30 75Z" fill="currentColor" />
    </svg>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const router = useRouter()
  const { addServiceItem } = useCart()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedValues, setSelectedValues] = useState({})
  const [selectedModifiers, setSelectedModifiers] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    servicesService.getBySlug(slug).then(data => {
      setService(data)
      if (data.variants?.length > 0) setSelectedVariant(data.variants[0])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [slug])

  useEffect(() => { setSelectedModifiers({}); setQuantity(1) }, [selectedVariant])

  const variants = (service?.variants || [])

  const attributeGroups = useMemo(() => {
    const groups = {}
    variants.forEach(v => {
      (v.attributeValues || []).forEach(av => {
        if (!av.attribute) return
        const aId = av.attribute.id
        if (!groups[aId]) groups[aId] = { name: av.attribute.name, ids: [], valueMap: {} }
        if (!groups[aId].valueMap[av.id]) {
          groups[aId].ids.push(av.id)
          groups[aId].valueMap[av.id] = av.value
        }
      })
    })
    return Object.entries(groups).map(([aId, g]) => ({
      attributeId: Number(aId),
      name: g.name,
      ids: g.ids,
      valueMap: g.valueMap,
    }))
  }, [variants])

  const derivedVariant = useMemo(() => {
    const selected = Object.values(selectedValues).filter(Boolean)
    if (!selected.length) return variants[0]
    return variants.find(v =>
      selected.every(vId => (v.attributeValues || []).some(av => av.id === vId))
    ) || variants[0]
  }, [variants, selectedValues])

  useEffect(() => {
    if (!attributeGroups.length || Object.keys(selectedValues).length) return
    const init = {}
    attributeGroups.forEach(g => { if (g.ids.length > 0) init[g.attributeId] = g.ids[0] })
    setSelectedValues(init)
  }, [attributeGroups])

  const variantLabel = useMemo(() => {
    if (!derivedVariant?.attributeValues?.length) return null
    return derivedVariant.attributeValues.map(av => av.value).join(' / ')
  }, [derivedVariant])

  const displayImages = useMemo(() => {
    if (derivedVariant?.images?.length > 0) return derivedVariant.images
    const attrImages = (derivedVariant?.attributeValues || [])
      .flatMap(av => av.images || [])
      .filter(Boolean)
    if (attrImages.length > 0) return attrImages
    return service?.images || []
  }, [derivedVariant, service])

  const activeModifiers = derivedVariant?.modifiers || []
  const modifiersTotal = Object.values(selectedModifiers).filter(Boolean).reduce((sum, m) => sum + Number(m.price), 0)
  const unitPrice = (derivedVariant ? Number(derivedVariant.price) : 0) + modifiersTotal
  const subtotal = unitPrice * quantity

  const handleToggleModifier = (modifier) => {
    const modKey = String(modifier.id)
    const maxSel = modifier.maxSelection || 1
    setSelectedModifiers(prev => {
      if (prev[modKey]) { const { [modKey]: _, ...rest } = prev; return rest }
      const count = Object.keys(prev).filter(k => activeModifiers.find(m => String(m.id) === k)).length
      if (maxSel && count >= maxSel) return prev
      return { ...prev, [modKey]: modifier }
    })
  }

  const handleAddToCart = () => {
    if (!derivedVariant || !service) return
    addServiceItem({
      serviceId: service.id, serviceSlug: service.slug, serviceName: service.name,
      variantId: derivedVariant.id, variantName: variantLabel || 'Base', variantPrice: Number(derivedVariant.price),
      selectedModifiers: Object.values(selectedModifiers).map(m => ({ id: m.id, name: m.name, price: Number(m.price) })),
      quantity,
    })
    setJustAdded(true); setTimeout(() => setJustAdded(false), 2000)
  }

  const handleWhatsApp = () => {
    if (!service) return
    const mods = Object.values(selectedModifiers)
    const modsText = mods.length > 0 ? mods.map(m => `${m.name}${m.price > 0 ? ` (+$${m.price})` : ''}`).join(', ') : 'Sin adicionales'
    const label = variantLabel || 'Base'
    const message = `Hola, quiero encargar:\n\n🌺 ${service.name}\n📋 ${label} — ${formatPrice(unitPrice)}\n🔧 ${modsText}\n🔢 Cantidad: ${quantity}\n💰 Total: ${formatPrice(subtotal)}`
    const wn = (JSON.parse(localStorage.getItem('store') || '{}')?.whatsapp_number || '').replace(/\D/g, '')
    window.open(`https://wa.me/${wn}?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (loading) return <div className="max-w-7xl mx-auto py-20 text-center"><p style={{ color: "var(--color-text-muted)" }}>Cargando...</p></div>
  if (!service) return (
    <section className="pt-32 pb-24 px-4 text-center">
      <h1 className="text-3xl font-normal mb-4" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>Servicio no encontrado</h1>
      <Link href="/servicios" style={{ color: "var(--color-primary)" }} className="hover:underline">Volver a servicios</Link>
    </section>
  )

  return (
    <>
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--color-background)", paddingTop: "5rem", paddingBottom: "3rem" }}>
        <PetalDeco className="absolute top-6 right-[7%] text-[var(--color-lila)] hidden md:block" style={{ width: 100, opacity: 0.08 }} />
        <div className="relative max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 mb-8 transition-colors" style={{ color: "var(--color-text-muted)" }} onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary)"} onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-muted)"}>
            <ArrowLeft className="w-4 h-4" />{content.serviceDetail.backTo}
          </button>
          <h1 className="mb-3" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.25rem, 5vw, 3rem)", fontWeight: 400, color: "var(--color-text-primary)" }}>{service.name}</h1>
          {service.description && <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "36rem" }}>{service.description}</p>}
          <div className="flex items-center gap-3 mt-4">
            <div className="h-px w-10" style={{ backgroundColor: "var(--color-border-hover)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-lila)", opacity: 0.7 }} />
            <div className="h-px w-20" style={{ backgroundColor: "var(--color-border-hover)" }} />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 space-y-8">
              {displayImages.length > 0 && (
                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
                  <img src={displayImages[0]} alt={service.name} className="w-full h-auto object-cover" />
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="sticky top-24 space-y-6">
                {attributeGroups.length >= 1 && (
                  <div className="space-y-4">
                    {attributeGroups.map(group => (
                      <div key={group.attributeId}>
                        <p className="text-sm font-medium mb-3" style={{ color: "var(--color-text-primary)" }}>{group.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.ids.map(vId => {
                            const selected = selectedValues[group.attributeId] === vId
                            return (
                              <button
                                key={vId}
                                onClick={() => setSelectedValues(prev => ({ ...prev, [group.attributeId]: vId }))}
                                className="text-xs px-3 py-1.5 rounded-full border transition-all"
                                style={{
                                  borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
                                  backgroundColor: selected ? "var(--color-primary-light)" : "transparent",
                                  color: selected ? "var(--color-primary)" : "var(--color-text-secondary)",
                                }}
                              >
                                {group.valueMap[vId]}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeModifiers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-3" style={{ color: "var(--color-text-primary)" }}>Adicionales:</p>
                    <div className="flex flex-col gap-2">
                      {activeModifiers.map(m => {
                        const sel = !!selectedModifiers[String(m.id)]
                        return (
                          <button key={m.id} onClick={() => handleToggleModifier(m)}
                            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left w-full ${sel ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'}`}
                            style={{ backgroundColor: sel ? 'rgba(164,176,144,0.1)' : 'transparent' }}>
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0" style={{ borderColor: sel ? "var(--color-accent)" : "var(--color-border)", backgroundColor: sel ? "var(--color-accent)" : "transparent" }}>
                                {sel && <Check className="w-3 h-3 text-white" />}
                              </span>
                              <span className="font-medium text-sm" style={{ color: "var(--color-text-primary)" }}>{m.name}</span>
                            </div>
                            {Number(m.price) > 0 && <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>+{formatPrice(m.price)}</span>}
                          </button>
                        )
                      })}
                    </div>
                </div>
              )}

                {derivedVariant && (
                  <div className="pt-6 space-y-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Precio unitario</span>
                      <span className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>{formatPrice(unitPrice)}</span>
                    </div>
                    {derivedVariant.durationMinutes && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                        <Clock className="w-4 h-4" />{content.serviceDetail.duration}: {derivedVariant.durationMinutes} min
                      </div>
                    )}
                    <QuantitySelector quantity={quantity} onIncrease={() => setQuantity(q => q + 1)} onDecrease={() => setQuantity(q => Math.max(1, q - 1))} />
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold" style={{ color: "var(--color-text-primary)" }}>Total</span>
                      <span className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                      <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 w-full px-6 py-3.5 font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
                        style={{ borderRadius: "2rem", backgroundColor: justAdded ? "var(--color-accent)" : "var(--color-primary)", boxShadow: justAdded ? "0 4px 16px rgba(164,176,144,0.3)" : "0 4px 14px rgba(203,110,228,0.35)" }}>
                        {justAdded ? <><Check className="w-5 h-5" />{content.serviceDetail.addedToCart}</> : content.serviceDetail.addToCart}
                      </button>
                      <button onClick={handleWhatsApp}
                        className="flex items-center justify-center gap-2 w-full px-6 py-3.5 font-semibold text-sm transition-all hover:-translate-y-0.5"
                        style={{ borderRadius: "2rem", border: "2px solid var(--color-primary)", color: "var(--color-primary)", backgroundColor: "transparent" }}>
                        {content.serviceDetail.requestWhatsApp}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
