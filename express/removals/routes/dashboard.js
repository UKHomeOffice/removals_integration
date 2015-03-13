var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Dashboard', list:['b','h','r'] });
});

module.exports = router;
