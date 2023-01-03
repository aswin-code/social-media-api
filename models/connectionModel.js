const mongoose = require('mongoose')

const connectionSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    followers: [{ follower: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } }],
    following: [{ follow: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } }],
})

const connectionModel = mongoose.model('connection', connectionSchema);
module.exports = connectionModel