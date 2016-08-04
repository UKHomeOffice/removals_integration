'use strict';

const validation_schema = require('removals_schema').heartbeat;
const service = require('../../../api/services/IrcEntryHeartbeatValidatorService');

describe('UNIT IrcEntryHeartbeatValidatorService', () => {
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
