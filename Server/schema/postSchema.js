const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    imageUrls: [{
        type: String,
    }],
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
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserProfile"
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserProfile'
    }
}, { timestamps: true });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;