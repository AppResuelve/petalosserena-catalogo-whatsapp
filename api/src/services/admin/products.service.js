const { Product, Category, sequelize } = require('../../models')
const { resolveDiscountFields } = require('../../utils/discount')

const list = async (query = {}) => {
  const { page = 1, limit = 20, search, categoryId, status } = query
  const offset = (page - 1) * limit

  const where = {}
  if (search) {
    where[require('sequelize').Op.or] = [
      { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
      { description: { [require('sequelize').Op.iLike]: `%${search}%` } },
    ]
  }
  if (categoryId) where.categoryId = categoryId
  if (status) where.status = status

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    order: [['name', 'ASC']],
    limit: Number(limit),
    offset,
  })

  return {
    products: rows,
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
  }
}

const getById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
  })
  if (!product) {
    throw Object.assign(new Error('Producto no encontrado'), { status: 404 })
  }
  return product
}

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 255)
}

const create = async (data) => {
  if (!data.slug && data.name) {
    data.slug = slugify(data.name)
  }

  const { comparePrice, discountPercentage } = resolveDiscountFields(
    data.retailPrice,
    data.comparePrice,
    data.discountPercentage
  )
  data.comparePrice = comparePrice
  data.discountPercentage = discountPercentage

  return Product.create(data)
}

const update = async (id, data) => {
  const product = await getById(id)
  if (!data.slug && data.name) {
    data.slug = slugify(data.name)
  }

  const { comparePrice, discountPercentage } = resolveDiscountFields(
    data.retailPrice ?? product.retailPrice,
    data.comparePrice,
    data.discountPercentage
  )
  data.comparePrice = comparePrice
  data.discountPercentage = discountPercentage

  return product.update(data)
}

const remove = async (id) => {
  const product = await getById(id)
  return product.destroy()
}

const CHUNK = 150

const bulkCreate = async (products, categoryId) => {
  const existingSlugs = new Set(
    (await Product.findAll({ attributes: ['slug'] })).map((p) => p.slug)
  )
  const used = new Set([...existingSlugs])
  const warnings = []

  const rows = products.map((p) => {
    const base = p.slug || slugify(p.name)
    let slug = base
    let suffix = 97 // 'a'

    while (used.has(slug)) {
      slug = `${base}-${String.fromCharCode(suffix)}`
      suffix++
    }

    used.add(slug)

    if (slug !== base) {
      warnings.push({ name: p.name, slug })
    }

    const retailPrice = Number(p.price) || 0
    const { comparePrice, discountPercentage } = resolveDiscountFields(
      retailPrice,
      p.comparePrice,
      p.discountPercentage
    )

    return {
      name: p.name,
      slug,
      retailPrice,
      status: 'draft',
      categoryId: categoryId || null,
      ...(p.description != null && p.description !== '' && { description: String(p.description) }),
      ...(discountPercentage != null && { discountPercentage }),
      ...(comparePrice != null && { comparePrice }),
      ...(p.wholesalePrice != null && p.wholesalePrice !== '' && { wholesalePrice: Number(p.wholesalePrice) }),
      ...(p.wholesaleMinQty != null && p.wholesaleMinQty !== '' && { wholesaleMinQty: Number(p.wholesaleMinQty) }),
      ...(p.images && { images: Array.isArray(p.images) ? p.images : [p.images] }),
    }
  })

  const t = await sequelize.transaction()
  try {
    for (let i = 0; i < rows.length; i += CHUNK) {
      await Product.bulkCreate(rows.slice(i, i + CHUNK), { validate: true, transaction: t })
    }
    await t.commit()
  } catch (err) {
    await t.rollback()
    throw err
  }

  return { created: rows.length, warnings }
}

module.exports = { list, getById, create, update, remove, bulkCreate }
