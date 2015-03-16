var express = require('express'),
router = express.Router(),
models = require("../lib/models"),
jade = require("jade"),
data_reader = require("../lib/data_reader.js");

/* GET home page. */
router.get('/', function(req, res, next) {
    var DR = new data_reader();
    DR.get_centres(function(list){
        res.render('dashboard', { title: 'Dashboard', 'list':list });
    });
});

module.exports = router;
