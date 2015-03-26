process.env.NODE_ENV = 'test';
CONFIG = require(process.cwd()+'/config/config').config; // global!
Sequelize = require("sequelize");
var sequelize_fixtures = require('sequelize-fixtures');
var models = require(process.cwd()+"/lib/models.js").models;
var chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('centre model',function(){
    it('should not be full if mostly female and female beds are available',function(){
        var data = {name:"Test Centre", capacity:500, capacity_female:300, current_beds_male:0, current_beds_female:1, current_beds_ooc:1};
        expect(models.Centre.build(data).is_full()).to.be.false;
    });
    it('should not be full if mostly male and male beds are available',function(){
        var data = {name:"Test Centre", capacity:500, capacity_female:200, current_beds_male:10, current_beds_female:0, current_beds_ooc:1};
        expect(models.Centre.build(data).is_full()).to.be.false;
    });
    it('should be full if mostly female and no female beds available',function(){
        var data = {name:"Test Centre", capacity:500, capacity_female:300, current_beds_male:10, current_beds_female:0, current_beds_ooc:1};
        expect(models.Centre.build(data).is_full()).to.be.true;
    });
    it('should be full if mostly male and no male beds available',function(){
        var data = {name:"Test Centre", capacity:500, capacity_female:200, current_beds_male:0, current_beds_female:10, current_beds_ooc:1};
        expect(models.Centre.build(data).is_full()).to.be.true;
    });
});
