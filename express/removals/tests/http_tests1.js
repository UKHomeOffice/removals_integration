var hippie = require('hippie');

var valid_json = {"totals":{"bed_counts":{"Colnbrook":{"male":1,"female":2,"out_of_commission":4}}}};
var valid_json3 = {"totals" : { "date" : "27-2-2015", "time" : "08:02:37", "bed_counts": { "Campsfield":{"male":51,"out_of_commission":3}, "Harmondsworth" : { "male" : 17, "out_of_commission": 1 }, "Colnbrook" : { "male" : 183, "female" : 8, "out_of_commission": 1 } } } };
var valid_json_invalid_centre = {"totals":{"bed_counts":{"Cindy Opera House":{"male":22,"female":9,"out_of_commission":2},"Morton Hall":{"male":42,"female":19,"out_of_commission":5}}}};
var valid_json_invalid_centre2 = {"totals":{"bed_counts":{"Yarls Wood":{"male":22,"female":9,"out_of_commission":2},"Mortuus Plango":{"male":42,"female":19,"out_of_commission":5}}}};
var valid_json_invalid_centre3 = {"totals":{"bed_counts":{"Madstop Bungalo":{"male":22,"female":9,"out_of_commission":2},"Potsdam Cottage":{"male":42,"female":19,"out_of_commission":5}}}};
var invalid_json = '{"totals":{"bed_counts:{"Yarls Wood":{"male":42,"female":19,"out_of_commission":5}}}}';

function api() {
  return hippie()
    .base('http://localhost:3000')
    .header("User-Agent", "hippie")
    .post('/update-centres');
}
/*
api()
    .get('/diagnostics')
    .expectStatus(200)
    .end(function(err,res,body) {
        if (err) throw err;
    });
*/

api()
    .json()
    .send(valid_json3)
    .expectStatus(200)
    .end(function(err,res,body) {
        console.log(body);
        if(err) throw err;
    });
/*
api()
    .send(invalid_json)
    .expectStatus(400)
    .end(function(err,res,body) {
        console.log(body);
        if(err) throw err;
    });

api()
    .json()
    .send(valid_json_invalid_centre)
    .expectStatus(404)
    .end(function(err,res,body) {
        console.log(body);
        if(err) throw err;
    });

api()
    .json()
    .send(valid_json_invalid_centre2)
    .expectStatus(404)
    .end(function(err,res,body) {
        console.log(body);
        if(err) throw err;
    });

api()
    .json()
    .send(valid_json_invalid_centre3)
    .expectStatus(404)
    .end(function(err,res,body) {
        console.log(body);
        if(err) throw err;
    });
*/
