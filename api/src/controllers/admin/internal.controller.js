const crypto = require('crypto')
const { User, Setting, Product, Service } = require('../../models')
const emailService = require('../../services/email.service')

const seedSettings = async (req, res, next) => {
  try {
    const data = req.body

    const mappings = {
      businessName: 'business_name',
      description: 'business_description',
      whatsappNumber: 'whatsapp_number',
      logoUrl: 'logo_url',
      faviconUrl: 'favicon_url',
      storeStatus: 'store_status',
      instagram: 'instagram',
      facebook: 'facebook',
      tiktok: 'tiktok',
      youtube: 'youtube',
    }

    for (const [field, mapping] of Object.entries(mappings)) {
      const config = typeof mapping === 'string' ? { key: mapping } : mapping
      const value = data[field]
      if (value !== undefined) {
        await Setting.upsert({ key: config.key, value })
      }
    }

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

const seedProducts = async (req, res, next) => {
  try {
    const { excelUrl, excelBase64, categoryId } = req.body
    let buffer

    if (excelBase64) {
      buffer = Buffer.from(excelBase64, 'base64')
    } else if (excelUrl) {
      try {
        const protocol = excelUrl.startsWith('https') ? require('https') : require('http')
        buffer = await new Promise((resolve, reject) => {
          protocol.get(excelUrl, (response) => {
            if (response.statusCode >= 300) {
              reject(new Error(`Error descargando Excel: ${response.statusCode}`))
              return
            }
            const chunks = []
            response.on('data', (c) => chunks.push(c))
            response.on('end', () => resolve(Buffer.concat(chunks)))
          }).on('error', reject)
        })
      } catch (downloadErr) {
        return res.status(400).json({ error: `No se pudo descargar el Excel: ${downloadErr.message}` })
      }
    } else {
      return res.status(400).json({ error: 'excelUrl o excelBase64 requerido' })
    }

    const XLSX = require('xlsx')
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    if (rows.length === 0) {
      return res.json({ created: 0, warnings: [] })
    }

    const headers = Object.keys(rows[0])
    const NAME_ALIASES = ['nombre', 'name', 'producto', 'product', 'product_name', 'producto_nombre']
    const PRICE_ALIASES = ['precio', 'price', 'importe', 'costo', 'valor', 'retail_price', 'precio_venta']

    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 255) || 'sin-nombre'

    const nameCol = NAME_ALIASES.reduce((found, alias) => found || headers.find((h) => h.toLowerCase().includes(alias)) || '', '') || headers[0]
    const priceCol = PRICE_ALIASES.reduce((found, alias) => found || headers.find((h) => h.toLowerCase().includes(alias)) || '', '') || headers[0]

    const products = rows
      .map((row) => {
        const name = String(row[nameCol] ?? '').trim()
        const price = row[priceCol]
        if (!name || price == null || price === '' || isNaN(Number(price)) || Number(price) < 0) return null
        return {
          name,
          slug: slugify(name),
          retailPrice: Number(price) || 0,
          status: 'draft',
          categoryId: categoryId || null,
        }
      })
      .filter(Boolean)

    await Product.bulkCreate(products, { validate: true })

    res.json({ created: products.length, warnings: [] })
  } catch (err) {
    next(err)
  }
}

const createAdmin = async (req, res, next) => {
  try {
    const { email, name } = req.body
    if (!email || !name) {
      return res.status(400).json({ error: 'email y name son requeridos' })
    }

    const existing = await User.findOne({ where: { role: 'admin' } })
    if (existing) {
      return res.status(409).json({ error: 'Ya existe un administrador' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const hash = crypto.createHash('sha256').update(token).digest('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    await User.create({
      email,
      name,
      password: '',
      status: 'pending',
      role: 'admin',
      activationTokenHash: hash,
      activationExpires: expires,
      activationSentAt: new Date(),
    })

    const origin = process.env.STORE_FRONTEND_URL || process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173'
    const adminOrigin = origin.replace(/^http:\/\//, '').includes('admin.') ? origin : origin.replace(/^https?:\/\//, 'https://admin.')
    const link = `${adminOrigin}/activate?token=${token}`

    await emailService.sendActivationEmail(email, link)

    res.status(201).json({ success: true })
  } catch (err) {
    next(err)
  }
}

const seedServices = async (req, res, next) => {
  try {
    const services = req.body
    if (!Array.isArray(services) || services.length === 0) {
      return res.json({ created: 0 })
    }

    const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 255)

    const rows = services
      .filter((s) => s.name?.trim())
      .map((s) => ({
        name: s.name.trim(),
        slug: slugify(s.name.trim()),
        description: s.description || null,
        price: Number(s.price) || 0,
        status: 'draft',
      }))

    if (rows.length > 0) {
      await Service.bulkCreate(rows, { validate: true })
    }

    res.json({ created: rows.length })
  } catch (err) {
    next(err)
  }
}

module.exports = { createAdmin, seedSettings, seedProducts, seedServices }
