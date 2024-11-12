const { Conversation } = require("../models/conversations.model.js");
const Message = require("../models/message.model.js")

const createMessage = async (req, res) => {
    try {
        const {sender, receiver, message} = req.body;
        if(!(sender && receiver && message)){
            return Response.json({
                success: false,
                message: "All fields are required."
            },
            {
                status: 400
            })
        }
    
        let conversation = await Conversation.findOne({
            participants: { $all : [sender, receiver] }
        })
        console.log(conversation, "conversation");
        const newMessage = await Message.create({
            sender,
            receiver,
            content: message
        })
    
        if(conversation){
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }
        else{
            conversation = await Conversation.create({
                participants: [sender, receiver],
                messages: [newMessage._id]
            });
        }
    
        return Response.json({
            success: true,
            message: "Message saved successfully"
        },{status: 200})

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error saving message"
            },
            {
                status: 500
            }
        )
    }
}

module.exports = {
    createMessage
}