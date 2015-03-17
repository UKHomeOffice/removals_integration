var hippie = require('hippie');

var valid_json = '{"totals":{"bed_counts":{"Morton Hall":{"male":42,"female":19,"out_of_commission":5}}}}';
var valid_json3 = '{"totals" : { "date" : "27-2-2015", "time" : "08:02:37", "bed_counts": { "Campsfield" : { "male" : 16, "female" : 2, "out_of_commission": 2 }, "Harmondsworth" : { "male" : 25, "female" : 1, "out_of_commission": 2 } } } }';
var valid_json_invalid_centre = '{"totals":{"bed_counts":{"Cindy Opera House":{"male":22,"female":9,"out_of_commission":2},"Morton Hall":{"male":42,"female":19,"out_of_commission":5}}}}';
var valid_json_invalid_centre2 = '{"totals":{"bed_counts":{"Yarls Wood":{"male":22,"female":9,"out_of_commission":2},"Mortuus Plango":{"male":42,"female":19,"out_of_commission":5}}}}';
var valid_json_invalid_centre3 = '{"totals":{"bed_counts":{"Madstop Bungalo":{"male":22,"female":9,"out_of_commission":2},"Potsdam Cottage":{"male":42,"female":19,"out_of_commission":5}}}}';
var invalid_json = '{"totals":{"bed_counts:{"Yarls Wood":{"male":42,"female":19,"out_of_commission":5}}}}';

function api() {
  return hippie()
    .base('http://localhost:3000')
    .header("User-Agent", "hippie")
    .post('/update-centres');
}

api()
    .send(valid_json3)
    .expectStatus(200)
    .end(function(err,res,body) {
        console.log(body);
        if(err) throw err;
    });
