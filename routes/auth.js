const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
//login

router.route('/login')
    .post(authController.login)

router.route('/register')
    .post(authController.register)

router.route('/google').post(authController.googleLogin)

router.route('/otp')
    .get(authController.sendOtp)
    .post(authController.verifyotp)

router.route('/refresh')
    .get(authController.refresh)
router.route('/forget')
    .post(authController.forgetPassword)

module.exports = router