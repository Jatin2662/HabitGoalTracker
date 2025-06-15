

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive:{
        type: Date
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    }
})

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;