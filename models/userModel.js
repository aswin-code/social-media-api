const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    refreshToken: [String],
    followers: [{ follower: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } }],
    following: [{ follow: { type: mongoose.Schema.Types.ObjectId, ref: 'user' } }],
    profilePic: String
});

const userModel = mongoose.model('user', userSchema)
module.exports = userModel