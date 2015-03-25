var express = require('express'),
    router = express.Router(),
    json_wrangler = require("../lib/json_wrangler"),
    data_reader = require("../lib/data_reader.js");

router.post('/', function(req, res, next) {
    req.setEncoding("utf8");
    var first_key = Object.keys(req.body)[0];
    if('undefined' == typeof(first_key)){
        res.status(400).json({"status":"ERROR","error":"Empty body, or content type was not application/json."});
    } else {
        if('{' == first_key.substr(0,1)) {
            var postData = first_key;
        } else {
            var postData = req.body;
        }
        if('string' == typeof(postData)){
            postData = JSON.parse(postData);
        }
        JW = new json_wrangler(true);
        try{
            JW.consume(postData,function(success, error){})
                .then(function(obj){
                    res.status(200).json({"status":"OK"});
                })
                .then(function(){
                    JW.update_centres()
                    .then(function(){
                        name_list = Object.keys(JW.data.totals.bed_counts);
                        var DR = new data_reader();
                        setTimeout(function(){
                            DR.get_centres_by_name_in(name_list,function(outlist){
                                console.log(outlist);
                            })});
                            io.emit("centre-update",postData);
                        },1000);
                })
                .then(null,function(err){
                    res.status(404).json({"status":"ERROR","error":err});
            });
        }catch(err){
            res.status(400).json({"status":"ERROR","error":err});
        }
    }
});

module.exports = router;

