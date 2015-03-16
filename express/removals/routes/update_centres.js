var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
        console.log("handling Centre update");
  var err = new Error('chicken');
  err.status = 404;
  next(err);
});

module.exports = router;

