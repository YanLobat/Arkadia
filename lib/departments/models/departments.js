var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Departments = new Schema({
	name: String,
    years: {},
});

module.exports = mongoose.model('departments', Departments);