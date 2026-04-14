const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        code: { type: String },
        otpSentAt: { type: Date },
    }
});


const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;