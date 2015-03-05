process.env.NODE_ENV = 'test';
CONFIG = require(process.cwd()+'/node/config').config; // global!
Sequelize = require("sequelize");
var sequelize_fixtures = require('sequelize-fixtures');
var models = require("../node/models.js").models;

var json_wrangler = require("../models/json_wrangler.js");
var chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('json_wrangler', function(){
    before(function(){
        require("../test/fix");
    });
    it('should do be able to load a Person by its cid_id',function(){
        JW = new json_wrangler();
        JW.find_by_cid_id('12346',function(p){
            p.gender.should.equal('f');
            p.id.should.equal(2);
        });
        //expect(P.gender).to.equal('f');
    });
});
