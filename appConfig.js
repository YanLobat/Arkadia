require('app-module-path').addPath(__dirname);

exports.setup = function(runningApp, callback) {
  // Nothing ever comes from "x-powered-by", but a security hole
  runningApp.disable("x-powered-by");

  // Choose your favorite view engine(s)
  runningApp.set('view engine', 'jade');


  //---- Mounting well-encapsulated application modules (so-called: "mini-apps")
  //---- See: http://expressjs.com/guide/routing.html and http://vimeo.com/56166857
  // API endpoint attached to root route:
  runningApp.use('/', require('items')); 

  runningApp.use('/departments', require('departments')); // attach to departments route
  
  if(typeof callback === 'function') {
    callback(runningApp);
  }
};
