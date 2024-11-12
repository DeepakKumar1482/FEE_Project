const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;