const sequelize = require('../config/database')

const models = {
  User: require('./User')(sequelize, require('sequelize').DataTypes),
  Product: require('./Product')(sequelize, require('sequelize').DataTypes),
  Category: require('./Category')(sequelize, require('sequelize').DataTypes),
  Order: require('./Order')(sequelize, require('sequelize').DataTypes),
  Setting: require('./Setting')(sequelize, require('sequelize').DataTypes),
  Media: require('./Media')(sequelize, require('sequelize').DataTypes),
  ChangeRequest: require('./ChangeRequest')(sequelize, require('sequelize').DataTypes),
  Service: require('./Service')(sequelize, require('sequelize').DataTypes),
}

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize

module.exports = models
