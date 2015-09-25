var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var router = express.Router();

router.use(bodyParser.json());

var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'Bad'
});

/* POST to submit route. */
router.post('/', function(req, res, next) {

    pool.getConnection(function(err, connection) {
        var query = "SELECT * FROM Centres WHERE name = '" + req.body.centre + "'";

        connection.query(query, function(err, rows) {
            var result = rows[0];

            var update = "UPDATE Centres SET ooc_male_beds = "+req.body.bed_counts.out_of_commission.ooc_male+", ooc_female_beds = "+req.body.bed_counts.out_of_commission.ooc_female+" WHERE centre_id = '" + result.centre_id + "'";

            connection.query(update, function(err,rows) {
                connection.release();

                res.send(rows.changedRows + ' rows changed from ' + update);

            });

//            res.send(req.body.centre + ' ' + req.body.operation + ' ooc male ' + parseInt(result.ooc_male_beds, 10) + ' -> ' + req.body.bed_counts.out_of_commission.ooc_male + ' ooc female ' + parseInt(result.ooc_female_beds, 10) +  ' -> ' + req.body.bed_counts.out_of_commission.ooc_female);
        });
    });


});

module.exports = router;
