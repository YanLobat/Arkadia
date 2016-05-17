var exports = module.exports;

var Departments   = require('../models/departments');

exports.getView = (req, res) => {
  let template = __dirname + '/../views/index';
  console.log(template);
  res.render(template, {});
};

exports.getDepartments = function(req, res) {


  Departments.find({},function(err,departments){
  	if (err){
  		res.status(500).json({message:"internal server error"});
  	}
  	res.status(200).json(departments);
  });

};