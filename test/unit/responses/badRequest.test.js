'use strict';

const proxyquire = require('proxyquire');
const getJSONresponse = sinon.stub();
const badRequestResponse = proxyquire('../../../api/responses/badRequest', {
  '../lib/helpers/json-api-response': getJSONresponse
});

describe('UNIT api/responses/badRequest', () => {
  let context = {}
  beforeEach(() => {
    context = {
      req: {
        method: '',
        _sails: {
          config: {
            environment: 'development'
          },
          log: {
            verbose: sinon.stub()
          }
        }
      },
      res: {
        status: sinon.stub(),
        jsonx: sinon.stub()
      }
    };
  });

  describe('in production it does not give anything away', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      context.req._sails.config.environment = 'production';
      badRequestResponse.call(context, 'something');
    });
    it('should have a 400 status code', () =>
      expect(context.res.jsonx).to.be.calledWith(undefined)
    );
  });

  describe('in development provide some help', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      badRequestResponse.call(context, 'something');
    });
    it('should have a 400 status code', () =>
      expect(context.res.jsonx).to.be.calledWith('something')
    );
  });

  describe('GET request', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      badRequestResponse.call(context);
    });
    it('should have a 400 status code', () =>
      expect(context.res.status).to.be.calledWith(400)
    );
  });

  describe('POST request', () => {
    beforeEach(() => {
      context.req.method = 'POST';
      badRequestResponse.call(context);
    });
    it('should have a 400 status code', () =>
      expect(context.res.status).to.be.calledWith(400)
    );
  });

  describe('PUT request', () => {

    describe('does return a body', () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({
          data: 'test'
        });
        badRequestResponse.call(context);
      });

      it('should have a 400 status code', () =>
        expect(context.res.status).to.be.calledWith(400)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({});
        badRequestResponse.call(context);
      });

      it('should have a 400 status code', () =>
        expect(context.res.status).to.be.calledWith(400)
      );
    });

  });

  describe('DELETE request', () => {

    describe('does return a body', () => {
      beforeEach(() => {
        context.req.method = 'DELETE';
        getJSONresponse.returns({
          data: 'test'
        });
        badRequestResponse.call(context);
      });
      it('should have a 400 status code', () =>
        expect(context.res.status).to.be.calledWith(400)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'DELETE';
        getJSONresponse.returns({});
        badRequestResponse.call(context);
      });
      it('should have a 400 status code', () =>
        expect(context.res.status).to.be.calledWith(400)
      );
    });

  });

});
