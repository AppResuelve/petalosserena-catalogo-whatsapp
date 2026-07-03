const tagsService = require('../../services/store/tags.service')

const list = async (req, res, next) => {
  try {
    const tags = await tagsService.list(req.query.categoryId || null)
    res.json(tags)
  } catch (err) { next(err) }
}

module.exports = { list }
