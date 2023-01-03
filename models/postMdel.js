
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    image: String,
    caption: String,
    Like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]

})

const postModel = mongoose.model('post', postSchema)

module.exports = postModel