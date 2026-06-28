import { servicesService } from '@/services/storeService'
import { serviceMetadata } from '@/lib/metadata'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import ServiceDetailClient from './client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const service = await servicesService.getBySlug(slug)
    return serviceMetadata(service)
  } catch { return {} }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await servicesService.getBySlug(slug)
  return (
    <>
      <ServiceJsonLd service={service} />
      <ServiceDetailClient service={service} />
    </>
  )
}
