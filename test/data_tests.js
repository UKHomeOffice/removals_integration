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
        //require("../test/fix");
        var json = '{"totals":{"bed_counts":{"Seacole":{"male":2,"female":3,"out_of_commission":3}}}}';
        JW = new json_wrangler(true);
        JW.consume(json);
        JW.update_centres();
    });
    it('should do be able to load a Person by its cid_id',function(){
        JW = new json_wrangler(true);
        JW.find_by_cid_id('12346',function(p){
            p.gender.should.equal('f');
            p.id.should.equal(2);
        });
    });
    it('should do be able to load a Centre by its name',function(){
        JW = new json_wrangler(true);
        JW.find_centre_by_name('Seacole',function(c){
            c.id.should.equal(2);
        });
    });
    it('should return null if non-existent centre name is searched',function(){
        JW = new json_wrangler(true);
        JW.find_centre_by_name('Noname-centre',function(c){
            should.equal(c,null);
        });
    });
    it('should update bed numbers for a centre',function(){
        var json = '{"totals":{"bed_counts":{"Seacole":{"male":232,"female":323,"out_of_commission":31415}}}}';
        JW = new json_wrangler(true);
        JW.consume(json);
        JW.update_centres().should.be.ok;
    });
    it('should have written the data by now',function(){
        JW.find_centre_by_name('Seacole',function(c){
            c.current_beds_ooc.should.equal(31415);
        });
    });
    it('should throw an error of it tries to consume invalid json',function(){
        var json = '{"totals":{"bed_counts":{"Noname-centre":{"male":232,"female":323,"out_of_commission":31415}}}';
        JW = new json_wrangler(false);
        expect(JW.consume.bind(JW,json)).to.throw('Input is not valid JSON');
    });
});
