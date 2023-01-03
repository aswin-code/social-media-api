const userModel = require('../models/userModel')

exports.getAllSuggestion = async (req, res) => {
    try {
        const currentUser = await userModel.findById(req.user)
        const users = await userModel.find({})

        const suggestions = users.filter((e) => e._id !== req.user)

    } catch (error) {
        console.log(error)
    }
}