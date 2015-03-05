process.env.NODE_ENV = 'test';
CONFIG = require(process.cwd()+'/node/config').config; // global!
Sequelize = require("sequelize");
var sequelize_fixtures = require('sequelize-fixtures');
var models = require("../node/models.js").models;

drop_tables();
setup_tables();
write_fixtures();

/*
function setup_tables(){
    models.Centre.sync({force:true})
        .then(function(){
            models.Person.sync({force:true});
        })
        .then(function(){
            models.Nationality.sync({force:true});
        });
}
*/
function drop_tables(){
    var keys = Object.keys(models).reverse();
    for(i in keys){
        console.log("DROPPING " + models[keys[i]]);
        models[keys[i]].drop();
    }
}
function setup_tables(){
    for(i in models){
        console.log("SYNCING " + i);
        models[i].sync();
    }
}
/*
function drop_tables(){
    models.Person.drop()
        .then(function(){
            models.Nationality.drop()
            .then(function(){
                models.Centre.drop();
            });
        });
}
*/
function write_fixtures(){
    var centres = [
        {
            model:"Centre",
            data:{
                "name": "Peel",
                "current_beds_male": 38,
                "current_beds_female": 48,
                "current_beds_ooc": 3
            }
        },
        {
            model:"Centre",
            data:{
                "name": "Seacole",
                "current_beds_male": 27,
                "current_beds_female": 18,
                "current_beds_ooc": 2
            }
        },
    ];
    var nationalities = [
        {
            model:"Nationality",
            data:{
                "name": "Afghanistan",
                "code": "AFG",
                "valid_from": null,
                "valid_to" : null,
                "replaced_by" : null
            },
        },
        {
            model:"Nationality",
            data:{
                "name": "Anguilla",
                "code": "AIA",
                "valid_from": "12/31/83",
                "valid_to" : null,
                "replaced_by" : null
            },
        },
        {
            model:"Nationality",
            data:{
                "name": "Australia",
                "code": "AUS",
                "valid_from": null,
                "valid_to" : null,
                "replaced_by" : null
            }
        }
    ];
    var people = [
        {
            model:"Person",
            data:{
                "cid_id": '12345',
                "gender": 'm'
            },
        },
        {
            model:"Person",
            data:{
                "cid_id": '12346',
                "gender": 'f'
            },
        },
        {
            model:"Person",
            data:{
                "cid_id": '12347',
                "gender": 'm'
            }
        }
    ];
    sequelize_fixtures.loadFixtures(nationalities, {Nationality:models.Nationality}).then(function(){
        console.log("wrote nationality fixtures");
        sequelize_fixtures.loadFixtures(centres, {Centre:models.Centre}).then(function(){
            console.log("wrote centre fixtures");
            sequelize_fixtures.loadFixtures(people, {Person:models.Person}).then(function(){
                console.log("wrote people fixtures");
            });
        });
    });
}
