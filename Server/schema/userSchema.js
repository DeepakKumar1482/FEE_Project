const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    techStack: {
        type: [String],
        required: true,
    },
    studyingAt: {
        type: String,
    },
    githubid: {
        type: String,
        required: true,
    },
    imageurl: {
        type: String,
        required: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel',
    }],
    savedposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel',
    }],
    connections: {
        type: [String],
    },
    githubTechStack: {
        type: [{
            type: String,
            type: Number,
        }]
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;