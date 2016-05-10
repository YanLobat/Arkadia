var router = require('express').Router({ mergeParams: true });
var path = require('path');
module.exports = router;

router.get('/', function(req, res) {

  var context = {};


  var template = 'index/views';
  console.log(template);
  return res.render('index/views/index');

});
