const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageUrls: {
        type: [String],
    },
    description: {
        type: String,
        required: true,
    },
    githubRepo: {
        type: String,
    },
    tech: {
        type: [String],
    },
    time: {
        date: String,
        time: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, { timestamps: true });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;