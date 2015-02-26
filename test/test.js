console.log(process.cwd()+'/node/config.js');
CONFIG = require(process.cwd()+'/node/config').config; // global!

var should = require('should');
var assert = require("assert");
var models = require("../node/models.js").models;

describe('Centre',function(){
    describe('#properties', function(){
        it('should have properties',function(){
            c = models.Centre;
            c.should.have.property('attributes');
            c.attributes.should.have.property('name');
            c.attributes.should.have.property('current_beds_male');
            c.attributes.should.have.property('current_beds_female');
            c.attributes.should.have.property('current_beds_ooc');
        })
    })
});
describe('Person',function(){
    describe('#properties', function(){
        it('should have properties',function(){
            p = models.Person;
            p.should.have.property('attributes');
            p.attributes.should.have.property('cid_id');
            p.attributes.should.have.property('gender');
        })
    })
});
