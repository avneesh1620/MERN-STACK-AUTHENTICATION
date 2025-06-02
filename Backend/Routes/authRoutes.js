import express from 'express'
import { getUserData, login, logout, register, resetPassword, sendResetOtp } from '../Controllers/authControllers.js'
import { userAuth } from '../Middleware/userAuth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/send-reset-otp', sendResetOtp)
router.post('/reset-password', resetPassword)
router.get('/profile', userAuth, getUserData)


export default router