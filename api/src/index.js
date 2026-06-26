const app = require('./app')
const { sequelize } = require('./models')
const { ensureDefaults } = require('./services/store/settings.service')

const PORT = process.env.PORT || 3001

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    await ensureDefaults()

    app.listen(PORT, () => {})
  } catch (err) {
    console.error('Error al iniciar el servidor:', err)
    process.exit(1)
  }
}

start()
