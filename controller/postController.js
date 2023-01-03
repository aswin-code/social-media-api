const postModel = require('../models/postMdel')
const cloudinary = require('../utils/cloudinary');
const upload = require('../s3')
exports.getAllPost = async (req, res) => {
    try {
        const posts = await postModel.find({}).populate('userid', '-password -refreshToken')
        console.log("posts:", posts)
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
        console.log(error)
    }
}
exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const file = req?.file
        const userid = req.user
        if (!caption) return res.status(400).json({ message: 'all fields require' })
        if (file) {
            const result = await cloudinary.uploader.upload(file.path)
            const newPost = new postModel({ userid, image: result.url, caption })
            await newPost.save()
        } else {
            const newPost = new postModel({ userid, caption })
            await newPost.save()
        }
        // const { error, key } = await upload.uploadToS3({ file, userId })
        // if (error) return res.status(500).json({ message: error.message })
        // console.log(key)
        return res.status(201).json({ message: 'post uploaded successfully' })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
        console.log(error)
    }
}
exports.getProfilePosts = async (req, res) => {
    try {
        const posts = await postModel.find({ userid: req.user })
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
        console.log(error)
    }
}

exports.deletePost = async (req, res) => {
    try {
        const postid = req.params.postid;
        const found = await postModel.findById(postid)
        if (!found) return res.status(404).json({ message: 'no post found' })
        if (found.userid !== req.user) return res.status(401).json({ message: 'you cant delete others post' })
        await postModel.findByIdAndDelete(found._id)
        return res.status(200).json({ message: 'post deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })
        console.log(error)
    }
}