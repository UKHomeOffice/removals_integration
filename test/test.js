var should = require('should');
var assert = require("assert");
var models = require("../node/models.js").models;

describe('User',function(){
    describe('#properties', function(){
        it('should have properties',function(){
            user = models.User;
            user.should.have.property('attributes');
            user.attributes.should.have.property('username');
            user.attributes.should.have.property('password');
        })
    })
});
