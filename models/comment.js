const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    comments: [{ userid: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, comment: String }]
})

const commentModel = mongoose.model('comments', commentSchema)

commentSchema.pre('remove', function (next) {
    try {
        this.model('post').pull()
    } catch (error) {
        console.log(error)
    }
})

module.exports = commentModel