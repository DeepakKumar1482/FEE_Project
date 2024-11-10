import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        index: true,
        trim: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true        
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    github: {
        type: String,
        unique: true
    },
    university:{
        type: String,
        required: true,
        trim: true
    },
    technologies: [
        {
            type: String,
            trim: true,
            enum: ['React JS', 'Next JS', 'Python', 'Node JS'],
            default: []
        }
    ],
},{timestamps: true})