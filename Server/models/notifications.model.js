const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationsSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'UserProfile',
    },
    notifications: [{
        isAccepted: {
            type: Boolean,
            default: false
        },
        userid:{
            type: Schema.Types.ObjectId,
            ref: 'UserProfile'
        }
    }],
    // isPending: {
    //     type: Boolean,
    //     default: true
    // }
},{timestamps: true})

const Notifications = mongoose.model("Notifications", NotificationsSchema);


module.exports = Notifications;
/*

 */