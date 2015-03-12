var Q = require('q');

var xisten = function(x){
    //throw new Error('gnnnn');
    if(x==0){
        throw("x was 0");
    }
    return x;
}
var prom = Q.fcall(xisten,23);
var prom0 = Q.fcall(xisten,0);

prom.then(
    console.log("hello")
).then(
    function(data){console.log("gday "+data);}
).then(
    null,function(err){console.log(err);}
);
