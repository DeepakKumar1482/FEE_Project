const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;