CONFIG = require(process.cwd()+'/node/config').config; // global!
var models = require("../node/models.js").models;

var json_wrangler = require("../models/json_wrangler.js");
var chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();
var fs = require('fs');

sample_json = '{"animal":"cow","plant":"asparagus"}';
invalid_json = '{"animal":"cow","plant":"asparagus"';
var sample_input;
fs.readFile("./sample_input.json", 'utf8', function(err,data){sample_input = data;});

describe('json_wrangler', function(){
    it('should consume json',function(){
        JW = new json_wrangler();
        JW.consume(sample_json).json.should.equal(sample_json);
    });
    it('should throw an error if json is invalid',function(){
        JW = new json_wrangler();
        expect(JW.consume.bind(JW,invalid_json)).to.throw('Input is not valid JSON');
    });
    it('should get the keys from the json input',function(){
        JW = new json_wrangler().consume(sample_json);
        assert.deepEqual(JW.data_keys(),["animal","plant"]);
        JW.consume(sample_input);
        assert.deepEqual(JW.data_keys(),["individuals","totals"]);
    });
    it('should count the inbound individuals',function(){
        JW = new json_wrangler().consume(sample_input);
        JW.count_inbound().should.equal(1);
    });
    it('should count the outbound individuals',function(){
        JW = new json_wrangler().consume(sample_input);
        JW.count_outbound().should.equal(3);
    });
    it('should produce hydrated data instances of people', function(){
        JW = new json_wrangler().consume(sample_input);
        var list_out = JW.get_outbound();
        list_out[0].cid_id.should.equal('654321');
        list_out[1].cid_id.should.equal('654322');
        list_out[2].cid_id.should.equal('654325');
        var list_in = JW.get_inbound();
        list_in[0].cid_id.should.equal('123456');
    });
});
