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
            if (!followerConnetion) {
                const newConnection = new connectionModel({ userid, followers: [req.user] })
                await newConnection.save()
                return res.status(200).json({ message: 'followed user successfully' })
            } else {
                followerConnetion.followers.push(req.user)
                await followerConnetion.save()
                return res.status(200).json({ message: 'followed user successfully' })
            }
        } else {
            const found = followconnection.following.find(e => e == userid)
            if (found) {
                await connectionModel.findByIdAndUpdate({ userid: req.user }, { $set: { $pull: { following: userid } } })
                await connectionModel.findByIdAndUpdate({ userid }, { $set: { $pull: { followers: req.userid } } })
                return res.status(200).json({ message: 'unfollowed successfull' })
            } else {
                followconnection.following.push(userid)
                await followconnection.save()
                if (!followerConnetion) {
                    const newConnection = new connectionModel({ userid, followers: [req.user] })
                    await newConnection.save()
                    return res.status(200).json({ message: 'followed user successfully' })
                } else {
                    followerConnetion.followers.push(req.user)
                    await followerConnetion.save()
                    return res.status(200).json({ message: 'followed user successfully' })
                }
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong' })
    }
}
exports.getConnection = async (req, res) => {
    try {
        const connection = await connectionModel.findOne({ userid: req.params.id || req.user }).populate('followers', '-password -refreshToken -verified').populate('following', '-password -refreshToken -verified')
        const userConnections = await connectionModel.findOne({ userid: req.user })
        const followerList = connection.followers.map(e => {
            if (userConnections.following.find(follow => follow == e._id)) {
                return {
                    ...e,
                    following: true
                }
            } else {
                return e
            }
        })
        res.status(200).json({ connection, followerList })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'something went wrong ' })
    }
}