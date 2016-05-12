var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Items = new Schema({
	name: String,
	purchases: [],
	total_quanity: String
});

module.exports = mongoose.model('items', Items);