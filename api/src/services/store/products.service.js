const { Product, Category } = require('../../models')

const list = async (query = {}) => {
  const { page = 1, limit = 50, search, categoryId, categorySlug } = query
  const offset = (page - 1) * limit

  const where = { status: 'active' }
  if (search) {
    where[require('sequelize').Op.or] = [
      { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
      { description: { [require('sequelize').Op.iLike]: `%${search}%` } },
    ]
  }
  if (categoryId) where.categoryId = categoryId

  const include = [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
  if (categorySlug) {
    include[0].where = { slug: categorySlug }
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    include,
    order: [['createdAt', 'DESC']],
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

const getBySlug = async (slug) => {
  const product = await Product.findOne({
    where: { slug, status: 'active' },
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
  })
  if (!product) {
    throw Object.assign(new Error('Producto no encontrado'), { status: 404 })
  }
  return product
}

module.exports = { list, getBySlug }
