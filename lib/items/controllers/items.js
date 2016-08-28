var exports = module.exports;

let Items   = require('../models/items');

exports.getView = (req, res) => {
  let template = __dirname + '/../views/index';
  res.render(template, {});
};

exports.getTopItems = (req, res) => {
  Items
  .find({})
  .sort({'total_quanity':'desc'})
  .limit(1000)
  .exec((err,items) => {
  	if (err){
  		res.status(500).json({message:"internal server error"});
  	}
  	res.status(200).json(items);
  });
};