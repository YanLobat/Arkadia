var exports = module.exports;

var Departments   = require('../models/departments');

exports.getDepartments = function(req, res) {


  Departments.find({},function(err,departments){
  	if (err){
  		res.status(500).json({message:"internal server error"});
  	}
  	let template = __dirname + '/../views/index';
  	let context = {
  		'departments': departments
  	}
  	res.render(template, context);
  });

};