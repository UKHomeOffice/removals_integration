'use strict';

const proxyquire = require('proxyquire');
const getJSONresponse = sinon.stub();
const serverErrorResponse = proxyquire('../../../api/responses/serverError', {
  '../lib/helpers/json-api-response': getJSONresponse
});

describe('UNIT api/responses/serverError', () => {
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
            error: sinon.stub()
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
      serverErrorResponse.call(context, 'something');
    });
    it('should have a 500 status code', () =>
      expect(context.res.jsonx).to.be.calledWith(undefined)
    );
  });

  describe('in development provide some help', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      serverErrorResponse.call(context, 'something');
    });
    it('should have a 500 status code', () =>
      expect(context.res.jsonx).to.be.calledWith('something')
    );
  });

  describe('GET request', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      serverErrorResponse.call(context);
    });
    it('should have a 500 status code', () =>
      expect(context.res.status).to.be.calledWith(500)
    );
  });

  describe('POST request', () => {
    beforeEach(() => {
      context.req.method = 'POST';
      serverErrorResponse.call(context);
    });
    it('should have a 500 status code', () =>
      expect(context.res.status).to.be.calledWith(500)
    );
  });

  describe('PUT request', () => {

    describe('does return a body', () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({
          data: 'test'
        });
        serverErrorResponse.call(context);
      });

      it('should have a 500 status code', () =>
        expect(context.res.status).to.be.calledWith(500)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({});
        serverErrorResponse.call(context);
      });

      it('should have a 500 status code', () =>
        expect(context.res.status).to.be.calledWith(500)
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
        serverErrorResponse.call(context);
      });
      it('should have a 500 status code', () =>
        expect(context.res.status).to.be.calledWith(500)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'DELETE';
        getJSONresponse.returns({});
        serverErrorResponse.call(context);
      });
      it('should have a 500 status code', () =>
        expect(context.res.status).to.be.calledWith(500)
      );
    });

  });

});
