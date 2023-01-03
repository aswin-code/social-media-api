const express = require('express')
const router = express.Router()
const postController = require('../controller/postController')
const commentController = require('../controller/commentController')
const likeController = require('../controller/LikeController')
const multer = require('multer')
const commentRouter = express.Router({ mergeParams: true })
const likeRouter = express.Router({ mergeParams: true })
const storage = multer.diskStorage({})
const upload = multer({ storage })
router.use('/:postid/comments', commentRouter)
router.use('/:postid/likes', likeRouter)
router.route('/')
    .get(postController.getAllPost)
    .post(upload.single('image'), postController.createPost)
router.route('/:postid')
    .get((req, res) => {
        console.log(req.params)
    })
    .delete(commentController.deleteComment)

//comments 
commentRouter.route('/')
    .get(commentController.getAllComments)
    .post(commentController.createAComment)
commentRouter.route('/:commentid')
    .get((req, res) => {
        console.log(req.params)
    })
    .delete(commentController.deleteComment)

// likes
likeRouter.route('/')
    .get(likeController.getLikedUsers)
    .post(likeController.like)
module.exports = router