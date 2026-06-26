const authMiddleware = require('../middleware/auth')
const storeStatusMiddleware = require('../middleware/storeStatus')

const mountRoutes = (app) => {
  // Auth (pública)
  app.use('/api/auth', require('./auth.routes'))

  // Admin (requiere JWT)
  app.use('/api/admin/dashboard', authMiddleware, require('./admin/dashboard.routes'))
  app.use('/api/admin/products', authMiddleware, require('./admin/products.routes'))
  app.use('/api/admin/categories', authMiddleware, require('./admin/categories.routes'))
  app.use('/api/admin/orders', authMiddleware, require('./admin/orders.routes'))
  app.use('/api/admin/settings', authMiddleware, require('./admin/settings.routes'))
  app.use('/api/admin/upload', authMiddleware, require('./admin/upload.routes'))
  app.use('/api/admin/change-requests', authMiddleware, require('./admin/changeRequests.routes'))
  app.use('/api/admin/services', authMiddleware, require('./admin/services.routes'))

  // Internal (requiere APPRESUELVE_SECRET — solo para la platform)
  app.use('/api/internal', require('./internal.routes'))

  // Store (pública — la consumen los templates de sitio web)
  app.use('/api/store/products', storeStatusMiddleware, require('./store/products.routes'))
  app.use('/api/store/categories', storeStatusMiddleware, require('./store/categories.routes'))
  app.use('/api/store/settings', require('./store/settings.routes'))
  app.use('/api/store/orders', storeStatusMiddleware, require('./store/orders.routes'))
}

module.exports = mountRoutes
