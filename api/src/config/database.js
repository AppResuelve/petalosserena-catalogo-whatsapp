require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })

const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: { require: true, rejectUnauthorized: false },
  } : {},
  define: {
    timestamps: true,
    underscored: true,
  },
})

module.exports = sequelize
