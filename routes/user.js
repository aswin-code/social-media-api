const router = require('express').Router()
const userController = require('../controller/userController')

router.route('/')
    .get(userController.getAllUsers)

router.route('/:id')
    .get(userController.getAUser)

router.route('/:id/follow')
    .post(userController.follow)
router.route('/:id/post')
    .get(userController.getUserPost)


module.exports = router