const userModel = require('../models/userModel')
const cloudinary = require('../utils/cloudinary');

exports.getProfile = async (req, res) => {
    try {
        const profile = await userModel.findById(req.user).select('-password').select('-refreshToken')
        res.status(200).json(profile)

    } catch (error) {
        console.log(error)
    }
}

exports.updateProfilePic = async (req, res) => {
    try {
        console.log(req.file)
        const file = req.file
        const result = await cloudinary.uploader.upload(file.path)
        await userModel.findByIdAndUpdate(req.user, { $set: { profilePic: result.url } })
        res.status(201).json({ message: 'profile updated successfully' })

    } catch (error) {
        console.log(error)
    }
}