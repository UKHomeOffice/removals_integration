var express = require('express'),
    router = express.Router(),
    io = require('socket.io'),
    json_wrangler = require("../lib/json_wrangler");

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log("handling Centre update");
    req.setEncoding("utf8");
    var postData = "";
    req.addListener("data", function(postDataChunk) {
        postData += postDataChunk;
        var code = 200;
        JW = new json_wrangler(true);
        try{
            JW.consume(postData,function(success, error){})
                .then(function(obj){
                    var body = '{"status":"OK"}';
                    res.writeHead(code, {"Content-Type": "application/json"});
                    res.write(body);
                    res.end();
                })
                .then(function(){
                    console.log("ABOUT TO UPDATE");
                    JW.update_centres();
                })
                .then(null,function(err){
                    console.log("Rejected "+err);
                    code = 404;
                    res.writeHead(code, {"Content-Type": "application/json"});
                    res.write('{"status":"ERROR","error":"'+err+'"}');
                    res.end();
            });
        }catch(err){
            console.log("GOT ERROR " + err);
            code = 400;
            res.writeHead(code, {"Content-Type": "application/json"});
            res.write('{"status":"ERROR","error":"'+err+'"}');
            res.end();
        }
    });
});

module.exports = router;

