const router = require('express').Router()
const userController = require('../controller/userController')
const connectionController = require('../controller/connection')

router.route('/')
    .get(userController.getAllUsers)

router.route('/:id')
    .get(userController.getAUser)

router.route('/:id/follow')
    .get(connectionController.getConnection)
    .post(connectionController.follow)
router.route('/:id/post')
    .get(userController.getUserPost)


module.exports = router