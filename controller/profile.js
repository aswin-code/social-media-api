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
        const { name } = req.body
        const file = req.file
        if (!name && !file) return res.status(400).json({ message: 'atleast one field require username or profile ' })
        if (file && !name) {
            const result = await cloudinary.uploader.upload(file.path)
            await userModel.findByIdAndUpdate(req.user, { $set: { profilePic: result.url } })
            return res.status(201).json({ message: 'profile updated successfully' })
        } else if (!file && name) {
            await userModel.findByIdAndUpdate(req.user, { $set: { name } })
            return res.status(201).json({ message: 'username updated successfully' })
        }
        const result = await cloudinary.uploader.upload(file.path)
        await userModel.findByIdAndUpdate(req.user, { $set: { profilePic: result.url, name } })
        res.status(201).json({ message: 'profile picture and username updated successfull' })


    } catch (error) {
        console.log(error)
    }
}