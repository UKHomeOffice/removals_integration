var Sequelize = require('sequelize')
    , sequelize = new Sequelize('dt_removal', 'root', 'root', {
        dialect: "mysql",
        port:    3306,
    });

sequelize
    .authenticate()
    .complete(function(err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    });

exports.sequelize = sequelize;

/*
var sys = require('sys');

var Client = require('mysql').Client;
var client = new Client();

client.user = 'someuser';
client.password = 'password';

client.connect(function(error, results) {
    if(error) {
        console.log('MySQL Connection Error: ' + error.message);
        return;
    }
    console.log('Connected to MySQL');
});

//Once the connection is made you set the MySQL table you want to use:
ClientConnectionReady = function(client)
{
    client.query('USE NodeSample', function(error, results) {
        if(error) {
            console.log('ClientConnectionReady Error: ' + error.message);
            client.end();
            return;
        }
    });
};*/
