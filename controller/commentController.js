
const commentModel = require('../models/comment')

exports.getAllComments = async (req, res) => {
    try {
        const { postid } = req.params
        const comments = await commentModel.findOne({ postid }).populate({ path: 'comments', populate: 'userid' })
        res.status(200).json(comments)

    } catch (error) {
        console.log(error)
    }
}

exports.createAComment = async (req, res) => {
    try {
        const { postid } = req.params
        const userid = req.user
        const comment = req.body.comment

        const found = await commentModel.findOne({ postid })
        if (!found) {
            const newComment = await commentModel({ postid, comments: [{ userid, comment }] })
            await newComment.save()
            return res.status(201).json({ message: 'commented successfully' })
        }
        await commentModel.findByIdAndUpdate(found._id, { $push: { comments: { userid, comment } } })
        res.status(201).json({ message: 'commented successfully' })

    } catch (error) {
        console.log(error)
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const postid = req.params.postid
        const found = await commentModel.fin
    } catch (error) {

    }
}