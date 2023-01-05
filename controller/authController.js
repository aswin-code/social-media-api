const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const otpModel = require('../models/otpModel');
const nodemailer = require('../utils/nodemailer')
const jwtDecode = require('jwt-decode');
const token = require('../utils/Token');

// register 
exports.register = asyncHandler(async (req, res) => {
    try {
        const { email, name, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'All fields are required' })
        const foundUser = await userModel.findOne({ email }).exec()
        console.log(foundUser)
        if (foundUser) return res.status(403).json({ message: 'User already exist' })
        const hash = await bcrypt.hash(password, 10)
        const newUser = new userModel({ email, password: hash, name })
        await newUser.save()
        await otpModel.findOneAndDelete({ email })
        const otp = Math.floor(1000 + Math.random() * 9000)
        const verifyOtp = new otpModel({
            email, otp
        })
        nodemailer.sendOtp({ email, otp })
        await verifyOtp.save()
        res.status(201).json({ message: 'account created successfully verify your account' })

    } catch (error) {

    }


})



// login
exports.login = asyncHandler(async (req, res) => {
    const { email, } = req.body;
    const pass = req.body.password
    if (!email || !pass) return res.status(400).json({ message: 'All fields are required' })

    const foundUser = await userModel.findOne({ email }).exec()

    if (!foundUser) return res.status(401).json({ message: 'Invalid Email or password' })
    const match = await bcrypt.compare(pass, foundUser.password)
    if (!match) return res.status(401).json({ message: 'Invalid Email or Password' })
    if (!foundUser.verified) return res.status(401).json({ message: 'please verify your account' })
    const accessToken = token.createAccessToken(foundUser._id)

    const refreshToken = token.createRefreshToken(foundUser._id)
    foundUser.refreshToken = [...foundUser.refreshToken, refreshToken]
    await foundUser.save();
    const user = await userModel.findById(foundUser._id).select('-password').select('-refreshToken')
    res.status(200).json({ accessToken, user, refreshToken })
})




// refresh token verification
exports.refresh = asyncHandler(async (req, res) => {

    const cookie = req?.headers?.referer;
    console.log(cookie)

    if (!cookie) return res.status(401).json({ message: "Unauthorized" })

    const refreshToken = cookie;
    const foundUser = await userModel.findOne({ refreshToken: refreshToken }).exec();
    console.log(foundUser)
    if (!foundUser) {
        console.log('working')
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, decoded) => {

            if (err) {
                console.log(err)
                return res.status(403);
            }
            const hacked = await userModel.findById(decoded.user).exec();
            hacked.refreshToken = [];
            await hacked.save()
            return res.status(403).json({ message: 'forbidden' })
        }))
        return
    }
    console.log(foundUser)
    const newArray = foundUser.refreshToken.filter(e => e !== refreshToken)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, asyncHandler(async (err, decoded) => {
        if (err) {

            foundUser.refreshToken = newArray
            await foundUser.save();
            console.log('err')
            return res.status(403).json({ message: 'forbidden' })
        }
        const newRefreshToken = token.createRefreshToken(foundUser._id)
        const accessToken = token.createAccessToken(foundUser._id)
        foundUser.refreshToken = [...newArray, newRefreshToken]
        await foundUser.save();
        res.status(200).json({ accessToken, refreshToken: newRefreshToken })
    }))
})


exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.query
        if (!email) return res.status(400).json({ message: 'all fields required' })
        await otpModel.findOneAndDelete({ email })
        const otp = Math.floor(1000 + Math.random() * 9000)
        const verifyOtp = new otpModel({
            email, otp
        })
        nodemailer.sendOtp({ email, otp })
        await verifyOtp.save()
        res.status(200).json({ message: 'otp send successfully' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong' })

    }
}



exports.verifyotp = async (req, res) => {
    try {
        const { otp, email } = req.body
        const found = await otpModel.findOne({ email })
        if (!found) return res.status(401).json({ message: 'something went wrong' })
        if (found.otp !== otp) return res.status(401).json({ message: 'invalid otp' });
        await userModel.findOneAndUpdate({ email }, { $set: { verified: true } })
        await otpModel.findOneAndDelete({ email })
        res.status(200).json({ status: 'ok', message: "otp verified successfully", verified: true })
    } catch (error) {
        console.log(error)
    }
}




// login with googlr





exports.googleLogin = asyncHandler(async (req, res) => {
    const credential = req.body.data.credential
    const { email, name } = jwtDecode(credential)
    const foundUser = await userModel.findOne({ email }).exec()
    if (foundUser) {
        const accessToken = token.createAccessToken(foundUser._id)
        const refreshToken = token.createRefreshToken(foundUser._id)
        foundUser.refreshToken = [...foundUser.refreshToken, refreshToken]
        await foundUser.save();
        res.cookie('jwt', refreshToken, {
            // httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ accessToken })
    } else {
        const newUser = new userModel({ email, name })
        const accessToken = token.createAccessToken(newUser._id)
        const refreshToken = token.createRefreshToken(newUser._id)
        await newUser.save()
        res.cookie('jwt', refreshToken, {
            // httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ accessToken })

    }
})
// logout

exports.logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;

    if (!cookie?.jwt) return res.status('204');
    res.clearCookie('jwt', { /*httpOnly: true,*/ sameSite: 'none', secure: true })
    res.json({ message: 'cookie cleared' })
})