const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');


const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(cors({
    cors: {
      origin: 'http://localhost:5173', // React frontend URL
      methods: ['GET', 'POST'],
      credentials: true
    }
  }));
const io = new Server(httpServer,{
    cors: {
    origin: 'http://localhost:5173', // React frontend URL
    methods: ['GET', 'POST'],
    credentials: true
    }
});
app.use('/api/user/', require('./Routes/userRoutes.js'))
app.use('/api/posts/', require('./Routes/PostRoutes.js'))



const users = new Set();
const userSocketid = {};
// console.log(userSocketid["xyz"]);
// const recipientSocketId = Object.keys(userSocketid).map(id => userSocketid[id] == "vishal" ? id : null)[0];
// console.log(recipientSocketId, "recipient");
// console.log(userSocketid[recipientSocketId], "rec");

let existingUser = null;

io.on('connection', (socket) => {
    socket.on('login', ({username}) => {
        users.add(username.trim());
        // userSocketid.forEach((value, key) => {
        //     if(username.trim() == value) existingUser = key;
        // })
        // if(existingUser) userSocketid.delete(existingUser);
        userSocketid[socket.id] = username.trim();
        console.log("user connected", username, users.size);
        console.log("onConnect ", userSocketid);
    })
    
    socket.on('privateChat', ({username, message, recipient}) => {
        const recipientSocketId = Object.keys(userSocketid).find(id => userSocketid[id] == recipient.trim());
        console.log("message on server", message);
        console.log(userSocketid, "userSocketid");
        console.log(recipientSocketId, "recipient");
        if(recipientSocketId){
            if(userSocketid[recipientSocketId] != username){
                io.to(recipientSocketId).emit('receiveMessage', { username, message });
            }
            else{
                io.to(socket.id).emit('receiveMessage', { username:"SERVER", message:"You cannot send message to yourself"})
            }
        }
        else{
            io.to(socket.id).emit('receiveMessage', { username:"SERVER", message:"Error sending message"})
        }
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

httpServer.listen(8080, (req, res) => {
    console.log('listening on port 8080');
})