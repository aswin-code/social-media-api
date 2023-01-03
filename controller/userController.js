const postModel = require('../models/postMdel')
const userModel = require('../models/userModel')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({ name: new RegExp(req.query.search, 'i') }).select('-password').select('-refreshToken')
        res.status(200).json(users.filter((e) => e._id != req.user))

    } catch (error) {
        console.log(error)
    }
}
exports.getAUser = async (req, res) => {
    try {
        const users = await userModel.findById(req.params.id).select('-password').select('-refreshToken')
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
}

exports.follow = async (req, res) => {
    try {
        const user = await userModel.findById(req.user)
        const found = user.following.find((e) => {
            console.log(e)
            return e.follow == req.params.id
        })
        if (!found) {
            await userModel.findByIdAndUpdate(req.user, { $push: { following: { follow: req.params.id } } })
            await userModel.findByIdAndUpdate(req.params.id, { $push: { followers: { follower: req.user } } })
            return res.status(201).json({ message: 'successfully followed' })
        }
        await userModel.findByIdAndUpdate(req.params.id, { $pull: { followers: { follower: req.user } } })
        await userModel.findByIdAndUpdate(req.user, { $pull: { following: { follow: req.params.id } } })
        return res.status(201).json({ message: 'successfully unfollowed' })
    } catch (error) {
        console.log(error)
    }
}
exports.getUserPost = async (req, res) => {
    try {
        const posts = await postModel.find({ userid: req.params.id }).populate('userid', '-password -refreshToken')
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
    }
}