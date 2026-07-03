const { Tag, TagValue, Product } = require('../../models')

const list = async (categoryId) => {
  const tags = await Tag.findAll({
    include: [{
      model: TagValue,
      as: 'values',
      order: [['sort_order', 'ASC']],
    }],
    order: [['sort_order', 'ASC']],
  })

  // Build a map of tag_value_id → isAvailable
  const isAvailableMap = new Map()

  if (tags.length === 0) return []

  const allValueIds = tags.flatMap(t => (t.values || []).map(v => v.id))

  if (allValueIds.length > 0) {
    const where = { status: 'active' }
    if (categoryId) {
      where.categoryId = Number(categoryId)
    }

    const products = await Product.findAll({
      where,
      include: [{
        model: TagValue,
        as: 'tagValues',
        where: { id: allValueIds },
        attributes: ['id'],
      }],
      attributes: ['id'],
    })

    const availableSet = new Set()
    products.forEach(p => {
      (p.tagValues || []).forEach(tv => availableSet.add(tv.id))
    })

    allValueIds.forEach(id => {
      isAvailableMap.set(id, availableSet.has(id))
    })
  }

  return tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    color: tag.color,
    sortOrder: tag.sortOrder,
    values: (tag.values || []).map(v => ({
      id: v.id,
      value: v.value,
      sortOrder: v.sortOrder,
      isAvailable: isAvailableMap.get(v.id) ?? false,
    })),
  }))
}

module.exports = { list }
