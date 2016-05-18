var exports = module.exports;

var Departments   = require('../models/departments');

exports.getView = (req, res) => {
  let template = __dirname + '/../views/index';
  console.log(template);
  res.render(template, {});
};

exports.getDepartments = function(req, res) {


  Departments.find({},function(err,departments){
  	let result = [];
  	let years = {};
  	//I should appologize for this logic but mongoose forced me do that after couple of hours
  	departments.forEach( (dept) => {
  		dept.purchases.forEach( (purchase) => {
	  		if(!years[purchase.year]){
	  			years[purchase.year] = [];
	  		}
	  		years[purchase.year].push(purchase);
	  	});
	  	let temp = {
	  		name: dept.name,
	  		years: years
	  	};
	  	result.push(temp);
	  	years = {};
  	});
  	if (err){
  		res.status(500).json({message:"internal server error"});
  	}
  	res.status(200).json(result);
  });

};