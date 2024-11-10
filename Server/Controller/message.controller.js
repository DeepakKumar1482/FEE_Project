const { Conversation } = require("../models/conversations.model.js");
const Message = require("../models/message.model.js")

const createMessage = async (req, res) => {
    try {
        const { sender, message } = req.body;
        const { receiver } = req.params;
        if(!sender || !receiver || !message){
            return res.status(200).json({
                success: false,
                message: "All fields required"
            })
        }
        const newMessage = await Message.create({
            sender,
            receiver,
            content: message
        })
        if(!newMessage){
            return res.status(404).json({
                success: false,
                message: "Error saving message to database"
            })
        }
        const conversation = await Conversation.findOne({
            participants: {
                $all : [sender, receiver]
            }
        })
        if(conversation){
            conversation.messages.push(newMessage._id);
            await conversation.save();
            return res.status(200).json({
                success: true,
                message: "Message saved successfully"
            })
        }
        const newConversation = await Conversation.create({
            participants: [sender, receiver],
            messages : [newMessage._id]
        })

        if(!newConversation){
            return res.status(400).json({
                success: false,
                message: "Error saving conversation"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Message saved successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error,
            message: "Internal Server error"
        })
    }
}

module.exports = {
    createMessage
}