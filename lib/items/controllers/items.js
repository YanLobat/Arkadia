var exports = module.exports;

let Items   = require('../models/items');

exports.getTopItems = function(req, res) {

  Items.find({},function(err,items){
  	if (err){
  		res.status(500).json({message:"internal server error"});
  	}
  	let template = __dirname + '/../views/index';
  	let context = {
  		'items': items
  	}
  	res.render(template, context);
  });
};