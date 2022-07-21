const mongoose = require('mongoose');
const User = require('./User');

const Contacts = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: function () {
            return !this.phoneNum;
        }
    },
    phoneNum: {
        type: String,
        required: function () {
            return !this.email;
        }
    },
    type: {
        type: String,
        default: 'Personal'
    },
    date: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Contacts', Contacts);
