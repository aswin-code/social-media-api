const connectionModel = require('../models/connection')
const userModel = require('../models/userModel')
exports.follow = async (req, res) => {
    try {
        const userid = req.params.id;
        if (userid == req.user) return res.status(400).json({ message: 'you cant follow yourself' })
        const found = await userModel.findById(userid)
        if (!found) return res.status(404).json({ message: 'no user found' })
        const followconnection = await connectionModel.findOne({ userid: req.user })
        const followerConnetion = await connectionModel.findOne({ userid })
        if (!followconnection) {
            const newConnection = new connectionModel({ userid: req.user, following: [userid] })
            await newConnection.save()
        }
        if (!followerConnetion) {
            const newConnection = new connectionModel({ userid, follower: [req.user] })
            await newConnection.save()
        }
        followerConnetion.follower.push(req.user)
        followconnection.following.push(userid)
        await followconnection.save()
        await followerConnetion.save()
        return res.status(200).json({ message: 'followed user successfully' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong' })
    }
}
exports.getConnection = async (req, res) => {
    try {
        const connection = await connectionModel.findOne({ userid: req.params.id })
        res.status(200).json(connection)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong ' })
    }
}