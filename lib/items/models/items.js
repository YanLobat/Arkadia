var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Items = new Schema({
	name: {type: String, sparse: true},
	price: Number,
	purchases: [],
	total_quanity: Number
});

module.exports = mongoose.model('items', Items);