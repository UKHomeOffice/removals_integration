/* global controller */
"use strict";
var jhg = require('../../helpers/JsonHelperGenerator');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var rewire = require('rewire');
var controller = rewire('../../../api/controllers/Irc_EntryController');

describe('INTEGRATION Irc_EntryController', () => {

  describe('process_event', () => {

    it('should handle INTER_SITE_TRANSFER operation', () => {
      const stubReturnValue = {};
      const handleInterSiteTransferStub = sinon.stub().returns(stubReturnValue);
      const originalHandleInterSiteTransferStub = controller.handleInterSiteTransfer;

      controller.handleInterSiteTransfer = handleInterSiteTransferStub;

      const request_body = {
        operation: Event.OPERATION_INTER_SITE_TRANSFER
      };
      const result = controller.process_event(request_body);

      expect(handleInterSiteTransferStub.calledWith(request_body)).to.equal(true);
      expect(result).to.be.equal(stubReturnValue);

      controller.handleInterSiteTransfer = originalHandleInterSiteTransferStub;
    });

    it('should handle UPDATE operation', () => {
      const stubReturnValue = {};
      const stub = sinon.stub().returns(stubReturnValue);
      const restoreMethod = controller.__set__('processEventDetainee', stub);

      const request_body = {
        operation: Event.OPERATION_UPDATE
      };
      const result = controller.process_event(request_body);

      expect(stub.calledWith(request_body)).to.equal(true);
      expect(result).to.be.equal(stubReturnValue);

      restoreMethod();
    });

    it('should handle CHECK_IN operation', () => {
      const processDetaineeStubReturnValue = {
        centre: {}
      };
      const processDetaineeStub = sinon.stub().resolves(processDetaineeStubReturnValue);
      const eventStubReturnValue = {};
      const EventCreateStub = sinon.stub().resolves(eventStubReturnValue);

      const request_body = {
        operation: Event.OPERATION_CHECK_IN,
        timestamp: new Date()
      };

      const restores = [];
      restores.push(controller.__set__('processEventDetainee', processDetaineeStub));
      restores.push(controller.__set__('Event.create', EventCreateStub));

      const result = controller.process_event(request_body);


      return result.then((result) => {
        expect(processDetaineeStub.calledWith(request_body)).to.equal(true);
        expect(EventCreateStub.calledWith({
          centre: processDetaineeStubReturnValue.centre,
          detainee: processDetaineeStubReturnValue,
          timestamp: request_body.timestamp,
          operation: request_body.operation
        })).to.equal(true);
        expect(result).to.be.equal(eventStubReturnValue);

        restores.forEach((restoreMethod) => {
          restoreMethod();
        });
      });
    });

    it('should handle CHECK_OUT operation', () => {
      const processDetaineeStubReturnValue = {
        centre: {}
      };
      const processDetaineeStub = sinon.stub().resolves(processDetaineeStubReturnValue);
      const eventStubReturnValue = {};
      const EventCreateStub = sinon.stub().resolves(eventStubReturnValue);

      const request_body = {
        operation: Event.OPERATION_CHECK_OUT,
        timestamp: new Date()
      };

      const restores = [];
      restores.push(controller.__set__('processEventDetainee', processDetaineeStub));
      restores.push(controller.__set__('Event.create', EventCreateStub));

      const result = controller.process_event(request_body);


      return result.then((result) => {
        expect(processDetaineeStub.calledWith(request_body)).to.equal(true);
        expect(EventCreateStub.calledWith({
          centre: processDetaineeStubReturnValue.centre,
          detainee: processDetaineeStubReturnValue,
          timestamp: request_body.timestamp,
          operation: request_body.operation
        })).to.equal(true);
        expect(result).to.be.equal(eventStubReturnValue);

        restores.forEach((restoreMethod) => {
          restoreMethod();
        });
      });
    });

    it('should handle REINSTATEMENT operation', () => {
      const processDetaineeStubReturnValue = {
        centre: {}
      };
      const processDetaineeStub = sinon.stub().resolves(processDetaineeStubReturnValue);
      const eventStubReturnValue = {};
      const EventCreateStub = sinon.stub().resolves(eventStubReturnValue);

      const request_body = {
        operation: Event.OPERATION_REINSTATEMENT,
        timestamp: new Date()
      };

      const restores = [];
      restores.push(controller.__set__('processEventDetainee', processDetaineeStub));
      restores.push(controller.__set__('Event.create', EventCreateStub));

      const result = controller.process_event(request_body);


      return result.then((result) => {
        expect(processDetaineeStub.calledWith(request_body)).to.equal(true);
        expect(EventCreateStub.calledWith({
          centre: processDetaineeStubReturnValue.centre,
          detainee: processDetaineeStubReturnValue,
          timestamp: request_body.timestamp,
          operation: request_body.operation
        })).to.equal(true);
        expect(result).to.be.equal(eventStubReturnValue);

        restores.forEach((restoreMethod) => {
          restoreMethod();
        });
      });
    });

  });
  describe('generateDetainee', () => {
    it('should return a object with the correct properties', () => {
      const centre = {};
      const properties = {
        person_id: {},
        timestamp: {},
        nationality: {},
        gender: 'male',
        cid_id: {}
      };
      const result = controller.__get__('generateDetainee')(centre, properties);
      expect(result.centre).to.equal(centre);
      expect(result.person_id).to.equal(properties.person_id);
      expect(result.timestamp).to.equal(properties.timestamp);
      expect(result.nationality).to.equal(properties.nationality);
      expect(result.gender).to.equal('male');
      expect(result.cid_id).to.equal(properties.cid_id);
    });
    it('should normalise gender f to female', () => {
      const centre = {};
      const properties = {
        gender: 'f'
      };
      const result = controller.__get__('generateDetainee')(centre, properties);
      expect(result.gender).to.equal('female');
    });
    it('should normalise gender m to male', () => {
      const centre = {};
      const properties = {
        gender: 'm'
      };
      const result = controller.__get__('generateDetainee')(centre, properties);
      expect(result.gender).to.equal('male');
    });
  });
  describe('generateStandardEvent', () => {
    it('should return an object with the correct properties', () => {
      const detainee = {
        centre: {}
      };
      const properties = {
        operation: {},
        timestamp: {}
      };
      const result = controller.__get__('generateStandardEvent')(detainee, properties);
      expect(result.detainee).to.equal(detainee);
      expect(result.centre).to.equal(detainee.centre);
      expect(result.operation).to.equal(properties.operation);
      expect(result.timestamp).to.equal(properties.timestamp);
    });
  });
  describe('processEventDetainee', () => {
    it('should call createOrUpdateDatainee', () => {
      const centre = {};
      const request_body = {
        centre: {},
        person_id: {},
        timestamp: {},
        nationality: {},
        gender: 'male',
        cid_id: {}
      };
      const detainee = {};
      const createReturnValue = {};

      const findOneStub = sinon.stub().resolves(centre);
      const generateDetaineeStub = sinon.stub().returns(detainee);
      const createOrUpdateDetaineeStub = sinon.stub().resolves(createReturnValue);

      const restores = [];
      restores.push(controller.__set__('Centres.findOne', findOneStub));
      restores.push(controller.__set__('createOrUpdateDetainee', createOrUpdateDetaineeStub));
      restores.push(controller.__set__('generateDetainee', generateDetaineeStub));

      controller.__get__('processEventDetainee')(request_body)
        .then((result) => {
          expect(findOneStub.calledWith({ name: request_body.centre })).to.equal(true);
          expect(generateDetaineeStub.calledWith(centre, request_body)).to.equal(true);
          expect(result).to.deep.equal(createReturnValue);

          restores.forEach((restoreMethod) => {
            restoreMethod();
          });
        });
    });
  });
  describe('handleInterSiteTransfer', () => {
    it('should split an event into a CHECK_IN and CHECK_OUT', () => {
      const centres = {
        to: {},
        from: {}
      };
      const base_request_body = {
        centre: {},
        person_id: {},
        timestamp: {},
        nationality: {},
        gender: {},
        cid_id: {}
      };
      const process_eventReturnValue = {};

      const expectedCheckOut = Object.assign({}, base_request_body, {
        centre: centres.to,
        operation: Event.OPERATION_CHECK_OUT
      });
      const expectedCheckIn = Object.assign({}, base_request_body, {
        centre: centres.from,
        operation: Event.OPERATION_CHECK_IN
      });
      const request_body = Object.assign({}, base_request_body, { centre_to: centres.to, centre: centres.from });

      const process_eventStub = sinon.stub().resolves(process_eventReturnValue);

      const orig_process_event = controller.process_event;
      controller.process_event = process_eventStub;

      controller.handleInterSiteTransfer(request_body)
        .then((result) => {
          expect(process_eventStub.calledWith(expectedCheckIn)).to.equal(true);
          expect(process_eventStub.calledWith(expectedCheckOut)).to.equal(true);
          expect(result).to.deep.equal(process_eventReturnValue);

          controller.process_event = orig_process_event;
        });
    });
  });
  describe('updateDetaineeModel', () => {
    it('should set the appropriate properties on the model', () => {
      const detainee = {};
      const newProperties = {
        timestamp: {},
        gender: {},
        nationality: {},
        cid_id: {}
      };

      controller.__get__('updateDetaineeModel')(detainee, newProperties);

      expect(detainee.timestamp).to.equal(newProperties.timestamp);
      expect(detainee.gender).to.equal(newProperties.gender);
      expect(detainee.nationality).to.equal(newProperties.nationality);
      expect(detainee.cid_id).to.equal(newProperties.cid_id);
    });

    it('should only set gender, nationality and cid_id if truthy', () => {
      const detainee = {
        timestamp: {},
        gender: {},
        nationality: {},
        cid_id: {}
      };
      const newProperties = {
        timestamp: {},
        gender: '',
        nationality: '',
        cid_id: ''
      };

      controller.__get__('updateDetaineeModel')(detainee, newProperties);

      expect(detainee.timestamp).to.equal(newProperties.timestamp);
      expect(detainee.gender).to.not.equal(newProperties.gender);
      expect(detainee.nationality).to.not.equal(newProperties.nationality);
      expect(detainee.cid_id).to.not.equal(newProperties.cid_id);
    });
  });

  describe('createOrUpdateDetainee ', () => {
    describe('when no matching detainee', () => {
      const restores = [];
      const createReturnValue = {};
      const findOneStub = sinon.stub().resolves(undefined);
      const createStub = sinon.stub().returns(createReturnValue);
      beforeEach(() => {
        restores.push(controller.__set__('Detainee.findOne', findOneStub));
        restores.push(controller.__set__('Detainee.create', createStub));
      });
      it('should create a new detainee', () => {
        const detaineeProperties = {
          centre: { id: {} },
          person_id: {},
          somethingElse: {}
        };
        const result = controller.__get__('createOrUpdateDetainee')(detaineeProperties);
        
        expect(findOneStub).to.have.been.calledWith({
          centre: detaineeProperties.centre.id,
          person_id: detaineeProperties.person_id
        });

        return expect(result).to.eventually.equal(createReturnValue);
      });
      afterEach(() => {
        restores.forEach((restore) => {
          restore();
        });
      });
    });

    describe('when new timestamp is later than old timestamp', () => {
      const restores = [];
      const saveReturnValue = {};
      const dummyDetaineeRecord = {
        timestamp: new Date('2016-05-01'),
        save: () => saveReturnValue
      };
      const findOneStub = sinon.stub().resolves(dummyDetaineeRecord);
      beforeEach(() => {
        restores.push(controller.__set__('Detainee.findOne', findOneStub));
      });
      it('should update the detainee', () => {
        const detaineeProperties = {
          centre: { id: {} },
          timestamp: (new Date('2016-05-02')).toISOString()
        };
        return expect(controller.__get__('createOrUpdateDetainee')(detaineeProperties)).to.eventually.equal(saveReturnValue);
      });
      afterEach(() => {
        restores.forEach((restore) => {
          restore();
        });
      });
    });

    describe('when new timestamp is earlier than old timestamp', () => {
      const restores = [];
      const dummyDetaineeRecord = {
        timestamp: new Date('2016-05-02')
      };
      const findOneStub = sinon.stub().resolves(dummyDetaineeRecord);
      beforeEach(() => {
        restores.push(controller.__set__('Detainee.findOne', findOneStub));
      });
      it('should return the found detainee', () => {
        const detaineeProperties = {
          centre: { id: {} },
          timestamp: (new Date('2016-05-01')).toISOString()
        };
        return expect(controller.__get__('createOrUpdateDetainee')(detaineeProperties)).to.eventually.equal(dummyDetaineeRecord);
      });
      afterEach(() => {
        restores.forEach((restore) => {
          restore();
        });
      });
    });
  });
});
