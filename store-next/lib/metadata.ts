const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://petalosserena.com.ar'

export const baseMetadata = {
  title: {
    default: 'Pétalos Serena',
    template: `%s — Pétalos Serena`,
  },
  description: 'Flores de tela artesanales que duran para siempre',
  icons: [{ url: '/logotipo.png' }],
  openGraph: {
    siteName: 'Pétalos Serena',
    images: [`${BASE_URL}/og-image.jpg`],
  },
}

export function productMetadata(product: any) {
  const desc = product?.description?.substring(0, 155)
  return {
    title: product?.name,
    description: desc,
    openGraph: {
      title: product?.name,
      description: desc,
      images: product?.images?.[0] ? [product.images[0]] : undefined,
      url: `${BASE_URL}/productos/${product?.slug}`,
    },
  }
}

export function serviceMetadata(service: any) {
  const desc = service?.description?.substring(0, 155)
  return {
    title: service?.name,
    description: desc,
    openGraph: {
      title: service?.name,
      images: service?.images?.[0] ? [service.images[0]] : undefined,
      url: `${BASE_URL}/servicios/${service?.slug}`,
    },
  }
}
