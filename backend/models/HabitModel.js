

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const habitSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    habit: { type: String, required: true },
    habitDescription: { type: String },
    repeat: {
        type: String,
        required: true
    },
    custom_repeat: {
        type: [String],
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: { type: Date },
    state: {
        type: String,
        enum: ['active', 'suspended', 'archived'],
        default: 'active'
    }
})

const HabitModel = mongoose.model('habits', habitSchema)
module.exports = HabitModel;