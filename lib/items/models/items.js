var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Items = new Schema({
	name: String,
	price: Number,
	purchases: [],
	total_quanity: Number
});

module.exports = mongoose.model('items', Items);