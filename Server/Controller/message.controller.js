const Conversation = require("../models/conversations.model.js");
const Message = require("../models/message.model.js");
const { io, userSocketid } = require("../server.js");

const sendMessage = async (req, res) => {
    try {
        const sender = req.user._id;
        const { receiver, message } = req.body;
        if (!(sender && receiver && message)) {
            return res
                .json({
                    success: false,
                    message: "All fields are required.",
                })
                .status(400);
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] },
        });

        const newMessage = await Message.create({
            sender,
            receiver,
            content: message,
        });

        if (conversation) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        } else {
            conversation = await Conversation.create({
                participants: [sender, receiver],
                messages: [newMessage._id],
            });
        }

        const msg = await newMessage.populate({
            path: "sender receiver",
            select: "username name imageurl",
        });

        // const recipientSocketId = Object.keys(userSocketid).find(
        //     (id) => userSocketid[id] == msg.receiver.username
        // );
        console.log(userSocketid[msg.receiver.username])
        io.to(userSocketid[msg.sender.username]).emit("receiveMessage", msg);
        // console.log(msg);
        if(userSocketid[msg.receiver.username]){
            console.log("inside the socketid ");
            io.to(userSocketid[msg.receiver.username]).emit("receiveMessage", msg);
        }
        // io.emit("privateChat", ({ username, message, recipient }) => {
        // });

        return res
            .json({
                success: true,
                message: "Message saved successfully",
            })
            .status(200);
    } catch (error) {
        return res
            .json({
                success: false,
                message: "Error saving message",
            })
            .status(500);
    }
};

const getMessage = async (req, res) => {
    try {
        const sender = req.user._id;
        const { receiver } = req.body;
        // const { cursor, limit } = req.body.param;

        if (!(sender && receiver)) {
            return res
                .json({
                    success: false,
                    message: "All fields are required.",
                })
                .status(400);
        }

        // NOTE: Below we used nested populate and other properties like we can pass array of multiple paths in the populate and can also use select property for field selection from document.

        // console.log("cursor" ,  cursor);

        const conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] },
        }).populate([
            // {
            //     path: "participants",
            //     select: "username name"
            // },
            {
                path: "messages",
                select: " -__v",
                // options: {
                //     sort: {updatedAt : -1},
                //     limit : Number(10),
                //     skip : (Number(cursor) - 1) * Number(limit)
                // },
                // limit: 10,
                populate: {
                    path: "sender receiver",
                    select: "username name imageurl",
                },
            },
        ]);
        // console.log(conversation);
        if (conversation) {
            return res
                .json({
                    success: true,
                    message: "Messages fetched successfully",
                    chats: conversation.messages,
                })
                .status(200);
        }
        return Response.json({
            success: false,
            message: `No conversation exists`,
            chats: [],
        }).status(404);
    } catch (error) {
        console.log(error);
        return res
            .json({
                success: false,
                message: "Error fetching messages",
            })
            .status(500);
    }
};

const getConversation = async (req, res) => {
    try {
        const sender = req.user._id;

        const conversation = await Conversation.find({
            participants: { $in: [sender] },
        }).populate({
            path: "participants",
            select: "username name imageurl _id",
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "No conversations found",
            });
        }
        // console.log(conversation);

        const response = conversation.flatMap((obj) =>
            obj.participants.filter(
                (participant) => participant.username !== req.user.username
            )
        );

        return res.status(200).json({
            success: true,
            message: "Conversations found successfully",
            conversations: response,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching conversations",
        });
    }
};
module.exports = {
    sendMessage,
    getMessage,
    getConversation,
};
