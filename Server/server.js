const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const connectdatabase = require('./db/connection.js');


const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(cors({
      origin: '*', // React frontend URL
      methods: ['GET', 'POST'],
      credentials: true
    }));
const io = new Server(httpServer,{
    cors: {
    origin: '*', // React frontend URL
    methods: ['GET', 'POST'],
    credentials: true
    }
});

const users = new Set();
const userSocketid = {};

module.exports = {
    users,
    userSocketid,
    io
}

let existingUser = null;

connectdatabase();


io.on('connection', (socket) => {
    socket.on('login', ({username}) => {
        users.add(username.trim());
        userSocketid[username.trim()] = socket.id;
        console.log("user connected", username, users.size, userSocketid[username]);
    })
    
    // socket.on('privateChat', ({username, message, recipient}) => {
    //     const recipientSocketId = Object.keys(userSocketid).find(id => userSocketid[id] == recipient.trim());
    //     if(recipientSocketId){
    //         if(userSocketid[recipientSocketId] != username){
    //             io.to(recipientSocketId).emit('receiveMessage', { username, message });
    //         }
    //         else{
    //             io.to(socket.id).emit('receiveMessage', { username:"SERVER", message:"You cannot send message to yourself"})
    //         }
    //     }
    //     else{
    //         io.to(socket.id).emit('receiveMessage', { username:"SERVER", message:"Error sending message"})
    //     }
    // })

    socket.on('typing', ({username}) => {
        socket.to(userSocketid[username]).emit("receiveTyping", ({typing: true}));
    })

    socket.on('disconnect', () => {
        const username = userSocketid[socket.id];
        if(username){
            users.delete(username);
            delete userSocketid[socket.id];
        }
        console.log("user disconnected", username, users.size);
    })
})


// httpServer.




const messageRouter = require('./Routes/message.routes.js');
app.use('/api/user/', require('./Routes/userRoutes.js'))
app.use('/api/posts/', require('./Routes/PostRoutes.js'))
app.use('/api/message', messageRouter);

app.get('/', (req, res) => {
    res.send('hell');
})

httpServer.listen(8080, '0.0.0.0', (req, res) => {
    console.log('listening on port 8080');
})