const mongoose = require('mongoose')


const paymentSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    age_range: String,
    creative_Background: String,
    ticket_bought: String,
    hear_us: String,
    join_us: String
}, {collection: 'payment'})

module.exports = mongoose.model('payment' , paymentSchema)