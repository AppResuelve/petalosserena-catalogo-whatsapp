export const siteData = {
  navbar: {
    logoOnly: false,
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Productos', href: '/productos' },
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
          { label: 'Carrito', href: '/carrito' },
          { label: 'Contacto', href: '/contacto' },
        ],
      },
    ],
  },

  cart: {
    persistenceEnabled: true,
    persistenceKey: 'olipetshop-cart',
    showDeliveryModal: true,
  },
}

export const content = {
  home: {
    hero: {
      badge: 'OliPetShop',
      title: 'Todo lo que tu mascota necesita',
      highlightedText: 'en un solo lugar',
      subtitle:
        'Alimentos, accesorios, juguetes y más. Encontrá todo para consentir a tu mejor amigo.',
      primaryButtonText: 'Ver productos',
      primaryButtonLink: '/productos',
      secondaryButtonText: 'Contactar',
      secondaryButtonLink: '/contacto',
    },
    featuredTitle: 'Productos destacados',
    featuredSubtitle: 'Los más elegidos por nuestros clientes',
    categoriesTitle: 'Categorías',
    categoriesSubtitle: 'Explorá por tipo de producto',
    cta: {
      title: '¿No encontrás lo que buscás?',
      subtitle: 'Contactanos y te ayudamos a encontrar lo que necesitás.',
      buttonText: 'Escribinos',
      buttonLink: '/contacto',
    },
  },

  products: {
    badge: 'Catálogo',
    title: 'Nuestros productos',
    subtitle: 'Encontrá lo que necesitás',
    noResults: 'No hay productos que coincidan con tu búsqueda.',
    clearFilters: 'Limpiar filtros',
  },

  productDetail: {
    backTo: 'Volver a productos',
    categoryLabel: 'Categoría',
    tagsLabel: 'Etiquetas',
    addToCart: 'Agregar al carrito',
    addedToCart: '¡Agregado!',
    relatedTitle: 'Productos relacionados',
  },

  cart: {
    title: 'Tu carrito',
    emptyTitle: 'Tu carrito está vacío',
    emptyMessage: 'Agregá productos para poder solicitar tu pedido.',
    browseProducts: 'Ver productos',
    itemCount: '{count} producto(s)',
    subtotal: 'Subtotal',
    total: 'Total estimado',
    requestQuote: 'Solicitar por WhatsApp',
    removeItem: 'Eliminar',
    clearCart: 'Vaciar carrito',
    continueShopping: 'Seguir comprando',
  },

  contact: {
    badge: 'Contacto',
    title: 'Hablemos',
    subtitle:
      '¿Tenés alguna pregunta o necesitás una cotización? Escribinos y te respondemos a la brevedad.',
    infoTitle: 'Encontranos',
  },

  notFound: {
    title: '404',
    subtitle: 'Página no encontrada',
    message: 'Lo sentimos, la página que buscás no existe o fue movida.',
    buttonText: 'Volver al inicio',
    buttonLink: '/',
  },
}
