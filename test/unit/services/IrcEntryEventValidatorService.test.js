'use strict';

const validation_schema = require('removals_schema').event;
const service = require('../../../api/services/IrcEntryEventValidatorService');

describe('UNIT IrcEntryEventValidatorService', function () {
  let originalvalidatorservice;
  before(() => {
    originalvalidatorservice = global.RequestValidatorService;
    global.RequestValidatorService = {
      validate: sinon.stub()
    };
    service.validate({centre: 'bar'});
  });
  after(() => global.RequestValidatorService = originalvalidatorservice);

  it('Should call the RequstValidatorService', () =>
      expect(global.RequestValidatorService.validate).to.be.calledWith({centre: 'bar'}, validation_schema)
  );
});
