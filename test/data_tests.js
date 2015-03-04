process.env.NODE_ENV = 'test';
CONFIG = require(process.cwd()+'/node/config').config; // global!
Sequelize = require("sequelize");
var models = require("../node/models.js").models;

var json_wrangler = require("../models/json_wrangler.js");
var chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('json_wrangler', function(){
    before(function(){
        //drop_tables();
        //setup_tables();
        //write_fixtures();
    });
    it('should do be able to load a Person by its cid_id',function(){
        JW = new json_wrangler();
        var P = JW.find_by_cid_id('12346');
console.log(P.gender);
        expect(P.gender).to.equal('f');
    });
});
//setup_tables();
function setup_tables(){
    for(i in models){
        console.log("SYNCING " + i);
        models[i].sync();
    }
}
function drop_tables(){
    var keys = Object.keys(models).reverse();
    for(i in keys){
        console.log("DROPPING " + models[keys[i]]);
        models[keys[i]].drop();
    }
}
function write_fixtures(){
    var centres = [
        {
            "name": "Peel",
            "current_beds_male": 38,
            "current_beds_female": 48,
            "current_beds_ooc": 3
        },
        {
            "name": "Seacole",
            "current_beds_male": 27,
            "current_beds_female": 18,
            "current_beds_ooc": 2
        },
    ];
    var people = [
        {
            "cid_id": '12345',
            "gender": 'm'
        },
        {
            "cid_id": '12346',
            "gender": 'f'
        },
        {
            "cid_id": '12347',
            "gender": 'm'
        }
    ];
    var nationalities = [
        {
            "name": "Afghanistan",
            "code": "AFG",
            "valid_from": null,
            "valid_to" : null,
            "replaced_by" : null,
        },
        {
            "name": "Anguilla",
            "code": "AIA",
            "valid_from": "12/31/83",
            "valid_to" : null,
            "replaced_by" : null,
        },
        {
            "name": "Australia",
            "code": "AUS",
            "valid_from": null,
            "valid_to" : null,
            "replaced_by" : null,
        }
    ];
    for(i in centres){
        models.Centre.build(centres[i]).save();
    }
    for(i in people){
        models.Person.build(people[i]).save();
    }
    for(i in nationalities){
        models.Nationality.build(nationalities[i]).save();
    }
}
