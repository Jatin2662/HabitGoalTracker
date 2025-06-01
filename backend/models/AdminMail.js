

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mailSchema = new Schema({

    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    end: {
        type: String,
        requierd: true
    }
}, { timestamps: true })

const MailModel = mongoose.model('mails', mailSchema)
module.exports = MailModel;