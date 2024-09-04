const express = require('express');
const cors = require('cors');
const app = express();
const connectdatabase = require('./db/connection.js');

connectdatabase();
app.use(express.json());
app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.static('/public'));
app.use('/api/user/', require('./Routes/userRoutes.js'))
app.use('/api/posts/', require('./Routes/PostRoutes.js'))
app.listen(8080, (req, res) => {
    console.log('listening on port 8080');
})