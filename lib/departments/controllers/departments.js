var exports = module.exports;

var Departments   = require('../models/departments');

exports.getDepartments = function(req, res) {


  var template = __dirname + '../views/index';
  res.render(template, {});

};