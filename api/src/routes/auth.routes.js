const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth')

const router = require('express').Router()

router.post('/login', authController.login)
router.get('/me', authMiddleware, authController.me)
router.post('/validate-token', authController.validateToken)
router.post('/activate', authController.activate)
router.put('/change-password', authMiddleware, authController.changePassword)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

module.exports = router
