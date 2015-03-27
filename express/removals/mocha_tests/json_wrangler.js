CONFIG = require(process.cwd()+'/config/config').config; // global!
var models = require(process.cwd()+"/lib/models.js").models;

var json_wrangler = require(process.cwd()+"/lib/json_wrangler.js");
var chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();
var fs = require('fs'), JW;

var sample_json = '{"animal":"cow","plant":"asparagus"}',
    invalid_json = '{"animal":"cow","plant":"asparagus"',
    sample_input;

fs.readFile(process.cwd()+"/tests/sample_input.json", 'utf8', function(err,data){sample_input = data;});

describe('json_wrangler', function(){
    it('should consume json',function(){
        JW = new json_wrangler(false);
        JW.consume(sample_json);
        JW.json.should.equal(sample_json);
    });
    it('should throw an error if json is invalid',function(){
        JW = new json_wrangler(false);
        expect(JW.consume.bind(JW,invalid_json)).to.throw('Input is not valid JSON');
    });
    it('should get the keys from the json input',function(){
        JW = new json_wrangler(false);
        JW.consume(sample_json);
        assert.deepEqual(JW.data_keys(),["animal","plant"]);
        JW.consume(sample_input);
        assert.deepEqual(JW.data_keys(),["individuals","totals"]);
    });
    it('should count the inbound individuals',function(){
        JW = new json_wrangler(false);
        JW.consume(sample_input);
        JW.count_inbound().should.equal(1);
    });
    it('should count the outbound individuals',function(){
        JW = new json_wrangler(false);
        JW.consume(sample_input);
        JW.count_outbound().should.equal(3);
    });
    it('should produce hydrated data instances of people', function(){
        JW = new json_wrangler(false);
        JW.consume(sample_input);
        var list_out = JW.get_outbound();
        list_out[0].cid_id.should.equal('654321');
        list_out[1].cid_id.should.equal('654322');
        list_out[2].cid_id.should.equal('654325');
        var list_in = JW.get_inbound();
        list_in[0].cid_id.should.equal('123456');
    });
});
