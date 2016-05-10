var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Items = new Schema({
    date: Date,
    department: String,
    item: String,
    price: String,
    quanity: String,
});

module.exports = mongoose.model('items', Items);