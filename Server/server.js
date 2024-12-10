const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const connectdatabase = require('./db/connection.js');
const crypto = require("crypto");
const Razorpay = require("razorpay");
const axios = require("axios");


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

let salt_key = process.env.SALT_KEY
let merchant_id = process.env.MERCHANT_ID

app.get("/", (req, res) => {
    res.send("server is running");
})

const razorpayInstance = new Razorpay({
    key_id: process.env.KEY_ID, // Replace with your Razorpay Key ID
    key_secret: process.env.KEY_SECRET, // Replace with your Razorpay Key Secret
});

// app.use("/api/pay", require("./Routes/payment.routes.js"))
app.post("/api/orders", async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post("/api/verify", (req, res) => {
    const { order_id, payment_id, signature } = req.body;

    const generatedSignature = crypto
        .createHmac("sha256", `${process.env.KEY_SECRET}`) // Use your Razorpay Key Secret
        .update(order_id + "|" + payment_id)
        .digest("hex");

    if (generatedSignature === signature) {
        res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
    }
});


app.post("/api/status", async (req, res) => {

    const merchantTransactionId = req.query.id
    const merchantId = merchant_id

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };

    // CHECK PAYMENT TATUS
    axios.request(options).then(async (response) => {
            if (response.data.success === true) {
                const url = `http://localhost:5173/success`
                return res.redirect(url)
            } else {
                const url = `http://localhost:5173/failure`
                return res.redirect(url)
            }
        })
        .catch((error) => {
            console.error(error);
        });

})

httpServer.listen(8080, '0.0.0.0', (req, res) => {
    console.log('listening on port 8080');
})