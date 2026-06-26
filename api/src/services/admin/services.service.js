const { Service } = require('../../models')

const slugify = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 255)
}

const list = async (query = {}) => {
  const { page = 1, limit = 20, search, status } = query
  const offset = (page - 1) * limit

  const where = {}
  if (search) {
    where[require('sequelize').Op.or] = [
      { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
      { description: { [require('sequelize').Op.iLike]: `%${search}%` } },
    ]
  }
  if (status) where.status = status

  const { count, rows } = await Service.findAndCountAll({
    where,
    order: [['name', 'ASC']],
    limit: Number(limit),
    offset,
  })

  return {
    services: rows,
    total: count,
    page: Number(page),
    totalPages: Math.ceil(count / limit),
  }
}

const getById = async (id) => {
  const service = await Service.findByPk(id)
  if (!service) throw Object.assign(new Error('Servicio no encontrado'), { status: 404 })
  return service
}

const create = async (data) => {
  if (!data.slug && data.name) data.slug = slugify(data.name)
  return Service.create(data)
}

const update = async (id, data) => {
  const service = await getById(id)
  if (!data.slug && data.name) data.slug = slugify(data.name)
  return service.update(data)
}

const remove = async (id) => {
  const service = await getById(id)
  return service.destroy()
}

module.exports = { list, getById, create, update, remove }
