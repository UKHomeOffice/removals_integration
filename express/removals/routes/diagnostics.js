var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var msglist = [];
    for(i in process.env){
        msglist.push(i + ": " + process.env[i]);
    }
    res.render('diagnostics', { title: 'Diagnostics','msglist':msglist });
});

module.exports = router;
