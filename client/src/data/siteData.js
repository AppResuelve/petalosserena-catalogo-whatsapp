export const siteData = {
  navbar: {
    logoOnly: false,
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Productos', href: '/productos' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Carrito', href: '/carrito', showCartCount: true },
      { label: 'Contacto', href: '/contacto' },
    ],
    ctaText: 'Ver carrito',
  },

  footer: {
    columns: [
      {
        title: 'Navegación',
        links: [
          { label: 'Inicio', href: '/' },
          { label: 'Productos', href: '/productos' },
          { label: 'Servicios', href: '/servicios' },
          { label: 'Carrito', href: '/carrito' },
          { label: 'Contacto', href: '/contacto' },
        ],
      },
    ],
  },

  cart: {
    persistenceEnabled: true,
    persistenceKey: 'petalosserena-cart',
    showDeliveryModal: false,
  },
}

export const content = {
  home: {
    hero: {
      badge: 'Pétalos Serena',
      title: 'Flores de tela artesanales',
      highlightedText: 'que duran para siempre',
      subtitle:
        'Ramos, arreglos y flores de tela hechos a mano. Perfectos para regalar sin fecha de vencimiento.',
      primaryButtonText: 'Ver productos',
      primaryButtonLink: '/productos',
      secondaryButtonText: 'Contactar',
      secondaryButtonLink: '/contacto',
    },
    featuredTitle: 'Colección',
    featuredSubtitle: 'Nuestros trabajos más recientes',
    categoriesTitle: 'Categorías',
    categoriesSubtitle: 'Explorá por tipo de flor',
    cta: {
      title: '¿Tenés un pedido especial?',
      subtitle: 'Hacemos arreglos personalizados para cualquier ocasión. Escribinos y lo charlamos.',
      buttonText: 'Consultar presupuesto',
      buttonLink: '/contacto',
    },
  },

  products: {
    badge: 'Catálogo',
    title: 'Nuestras flores',
    subtitle: 'Encontrá el ramo perfecto',
    noResults: 'No hay productos que coincidan con tu búsqueda.',
    clearFilters: 'Limpiar filtros',
  },

  productDetail: {
    backTo: 'Volver al catálogo',
    categoryLabel: 'Categoría',
    tagsLabel: 'Etiquetas',
    addToCart: 'Agregar al carrito',
    addedToCart: '¡Agregado!',
    relatedTitle: 'También te puede gustar',
  },

  cart: {
    title: 'Tu pedido',
    emptyTitle: 'Tu pedido está vacío',
    emptyMessage: 'Elegí tus flores favoritas para armar el ramo que querés.',
    browseProducts: 'Ver flores',
    itemCount: '{count} producto(s)',
    subtotal: 'Subtotal',
    total: 'Total',
    requestQuote: 'Encargar por WhatsApp',
    removeItem: 'Eliminar',
    clearCart: 'Vaciar carrito',
    continueShopping: 'Seguir eligiendo',
  },

  contact: {
    badge: 'Contacto',
    title: 'Hablemos',
    subtitle:
      '¿Tenés alguna pregunta o querés un arreglo personalizado? Escribinos y te respondemos a la brevedad.',
    infoTitle: 'Encontranos',
  },

  notFound: {
    title: '404',
    subtitle: 'Página no encontrada',
    message: 'Lo sentimos, la página que buscás no existe o fue movida.',
    buttonText: 'Volver al inicio',
    buttonLink: '/',
  },

  services: {
    badge: 'Servicios',
    title: 'Nuestros servicios',
    subtitle: 'Decoración y arreglos para eventos',
    noResults: 'No hay servicios disponibles en este momento.',
  },

  serviceDetail: {
    backTo: 'Volver a servicios',
    addToCart: 'Agregar al carrito',
    addedToCart: '¡Agregado!',
    requestWhatsApp: 'Pedir por WhatsApp',
    duration: 'Duración estimada',
  },
}
