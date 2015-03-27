var express = require('express'),
    router = express.Router(),
    json_wrangler = require("../lib/json_wrangler"),
    Q = require('q'),
    data_reader = require("../lib/data_reader.js");

router.get('/', function(req, res, next) {
    res.status(400).json({"status":"ERROR","error":"This endpoint is post only."});
});

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
                    var deferred = Q.defer();
                    res.status(200).json({"status":"OK"});
                    deferred.resolve();
                    return deferred.promise;
                })
                .then(function(){
                    return JW.update_centres();
                })
                .then(function(){
                    var bed_counts = Object.keys(JW.data.totals.bed_counts);
                    for(i in bed_counts){
                        var centre_name = bed_counts[i];
                        var centre = JW.find_centre_by_name(centre_name)
                        .then(function(centre){
                            centre.dataValues.is_full = centre.is_full();
                            centre.dataValues.slug = centre.name.replace(/([^\w])/g,'').toLowerCase();
                            io.emit('centre-update',centre);
                        });
                    }
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

