const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const connectdatabase = require('./db/connection.js');


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

const users = new Set();
const userSocketid = {};

let existingUser = null;

connectdatabase();


io.on('connection', (socket) => {
    socket.on('login', ({username}) => {
        users.add(username.trim());
        userSocketid[socket.id] = username.trim();
        console.log("user connected", username, users.size);
    })
    
    socket.on('privateChat', ({username, message, recipient}) => {
        const recipientSocketId = Object.keys(userSocketid).find(id => userSocketid[id] == recipient.trim());
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




const messageRouter = require('./Routes/message.routes.js');
app.use('/api/user/', require('./Routes/userRoutes.js'))
app.use('/api/posts/', require('./Routes/PostRoutes.js'))
app.use('/api/message', messageRouter);