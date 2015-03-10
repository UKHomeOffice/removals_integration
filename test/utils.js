process.env.NODE_ENV = 'test';
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should(),
    utils = require('../node/utils').utils,
    models = require("../node/models.js").models,

    sample_csv = 'name,code,valid_from,valid_to,replaced_by,also_included,notes'+
        '\r\nAnguilla,AIA,12/31/83,,,,'+
        '\r\nAntigua and Barbuda,ATG,,,,,' +
        '\r\nArgentina,ARG,,,,,' +
        '\r\nArmenia,ARM,12/31/92,,,,' +
        '\r\nAustralia,AUS,,,,"Christmas Island, Cocos (Keeling) Islands, Norfolk Island",';

describe('utils functions', function() {
    it('should parse a date', function() {
        expect(utils.parseDate('01/02/99').toString()).to.equal(new Date('1999', 1,1).toString());
        expect(utils.parseDate('9/1/08').toString()).to.equal(new Date('2008', 0,9).toString());
    });
    it('should parse CSV', function() {
        utils.write_csv_to_db(models.Nationality, sample_csv);
    });
});