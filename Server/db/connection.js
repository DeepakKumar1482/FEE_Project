const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.mongo_uri;

console.log(uri);

const connectmongodb = async(req, res) => {
    try {
        const res = await mongoose.connect(uri);
        console.log('connected to mongodb successfully');
    } catch (e) {
        console.log(e);
    }
}
module.exports = connectmongodb