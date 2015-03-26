process.env.NODE_ENV = 'test';
var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should(),
    Sequelize = require('sequelize'),
    db = require(process.cwd()+"/config/db").db,
    sequelize = db.sequelize,
    utils = require(process.cwd()+'/lib/utils').utils,
    models = require(process.cwd()+"/lib/models.js").models,

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
        console.log('START');
        sequelize
            .sync({ force: true })
            .then(function() {
                console.log('DB det up');
                utils.write_csv_to_db(models.Nationality, null, sample_csv, function (errors) {
                    console.log('ERROR LIST ', errors);
                    expect(errors.length).to.equal(0);
                    models.Nationality
                        .find({ where: { name: 'Anguilla' } })
                        .then(function (n) {
                            console.log('***found*** ' + n.name);
                            expect(n.code).to.equal('AIA');
                        });
                    models.Nationality
                        .find({ where: { code: 'AUS' } })
                        .then(function (n) {
                            console.log('***found*** ' + n.name);
                            expect(n.also_included).to.equal('Christmas Island, Cocos (Keeling) Islands, Norfolk Island');
                        });
                });
            });
    });

});
