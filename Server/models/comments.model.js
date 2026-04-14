const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "UserProfile"
    },
    text: {
        type: String,
        trim: true,
        required: true
    },
},{timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;