
const postModel = require('../models/postMdel');

exports.like = async (req, res) => {
    try {
        const found = await postModel.findById(req.params.postid)
        console.log(found)
        found.Like.find((e) => e === req.user) ? found.Like = found.Like.filter((e) => e !== req.user) : found.Like = [...found.Like, req.user];
        await found.save()
        res.status(201).json({ message: 'liked a post' })
    } catch (error) {
        console.log(error)
    }
}
exports.getLikedUsers = async (req, res) => {
    try {
        const postid = req.params.postid
        const post = await postModel.findById(postid).populate('like')
        if (!post) return res.status(404).json({ message: 'no post found' })
        return res.status(200).json({ likedUser: post.like })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
        console.log(error)
    }
}