/**
* This is a "mini-app" that encapsulates router definitions. See more
* at: http://expressjs.com/guide/routing.html (search for "express.Router")
*
*/
let app = require('express')();
let router = require('express').Router({ mergeParams: true });
module.exports = router;

// Don't just use, but also export in case another module needs to use these as well.
router.callbacks    = require('./controllers/items');
router.models       = require('./models/items');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

router.get('/', router.callbacks.getView);
router.get('/get', router.callbacks.getTopItems);

