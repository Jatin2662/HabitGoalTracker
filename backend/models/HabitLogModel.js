

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    habitId: {
        type: Schema.Types.ObjectId,
        ref: 'habits',
        required: true
    },
    habit: {
        type: String,
        required: true
    },
    habitDescription: { type: String },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'missed'],
        default: 'pending'
    }
}, {
    timestamps: true
})

const HabitLogModel = mongoose.model('habitLogs', habitLogSchema);
module.exports = HabitLogModel;