const { Product, Category, ProductSku, AttributeValue, Attribute, TagValue, Tag } = require('../../models')

const skuInclude = {
  model: ProductSku,
  as: 'skus',
  where: { status: 'active' },
  required: false,
  include: [{
    model: AttributeValue,
    as: 'attributeValues',
    through: { attributes: [] },
    include: [{ model: Attribute, as: 'attribute' }],
  }],
  order: [['sort_order', 'ASC']],
}

const list = async (query = {}) => {
  const { page = 1, limit = 50, search, categoryId, categorySlug, tagIds } = query
  const offset = (page - 1) * limit

  const where = { status: 'active' }
  if (search) {
    where[require('sequelize').Op.or] = [
      { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
      { description: { [require('sequelize').Op.iLike]: `%${search}%` } },
    ]
  }
  if (categoryId) where.categoryId = categoryId

  const include = [
    { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
    skuInclude,
    { model: TagValue, as: 'tagValues', include: [{ model: Tag, as: 'tag' }] },
  ]
  if (categorySlug) {
    include[0].where = { slug: categorySlug }
  }
  if (tagIds) {
    const ids = Array.isArray(tagIds) ? tagIds : tagIds.split(',').map(Number).filter(Boolean)
    if (ids.length > 0) {
      include[2].where = { id: { [require('sequelize').Op.in]: ids } }
    }
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    include,
    distinct: true,
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
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      skuInclude,
      { model: TagValue, as: 'tagValues', include: [{ model: Tag, as: 'tag' }] },
    ],
  })
  if (!product) {
    throw Object.assign(new Error('Producto no encontrado'), { status: 404 })
  }
  return product
}

module.exports = { list, getBySlug }
