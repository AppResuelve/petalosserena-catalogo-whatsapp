import { productsService, servicesService } from '@/services/storeService'

export default async function sitemap() {
  const base = 'https://petalosserena.com.ar'

  const staticPages = [
    { url: base, lastModified: new Date() },
    { url: `${base}/productos`, lastModified: new Date() },
    { url: `${base}/servicios`, lastModified: new Date() },
    { url: `${base}/carrito`, lastModified: new Date() },
    { url: `${base}/contacto`, lastModified: new Date() },
  ]

  const [productRes, serviceRes] = await Promise.all([
    productsService.list({ limit: 500 }).catch(() => ({ products: [] })),
    servicesService.list({ limit: 100 }).catch(() => ({ services: [] })),
  ])

  const productPages = (productRes?.products || []).map((p: any) => ({
    url: `${base}/productos/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }))

  const servicePages = (serviceRes?.services || []).map((s: any) => ({
    url: `${base}/servicios/${s.slug}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
  }))

  return [...staticPages, ...productPages, ...servicePages]
}
