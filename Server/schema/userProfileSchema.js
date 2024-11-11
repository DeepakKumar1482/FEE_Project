const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
            name: { type: String },
            count: { type: Number },
        }]
    },
});

const ProfileModel = mongoose.model('UserProfile', userProfileSchema);

module.exports = ProfileModel;
