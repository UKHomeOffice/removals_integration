'use strict';

const proxyquire = require('proxyquire');
const getJSONresponse = sinon.stub();
const unprocessableEntityResponse = proxyquire('../../../api/responses/unprocessableEntity', {
  '../lib/helpers/json-api-response': getJSONresponse
});

describe('UNIT api/responses/unprocessableEntity', () => {
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
      unprocessableEntityResponse.call(context, 'something');
    });
    it('should have a 422 status code', () =>
      expect(context.res.jsonx).to.be.calledWith(undefined)
    );
  });

  describe('in development provide some help', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      unprocessableEntityResponse.call(context, 'something');
    });
    it('should have a 422 status code', () =>
      expect(context.res.jsonx).to.be.calledWith('something')
    );
  });

  describe('GET request', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      unprocessableEntityResponse.call(context);
    });
    it('should have a 422 status code', () =>
      expect(context.res.status).to.be.calledWith(422)
    );
  });

  describe('POST request', () => {
    beforeEach(() => {
      context.req.method = 'POST';
      unprocessableEntityResponse.call(context);
    });
    it('should have a 422 status code', () =>
      expect(context.res.status).to.be.calledWith(422)
    );
  });

  describe('PUT request', () => {

    describe('does return a body', () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({
          data: 'test'
        });
        unprocessableEntityResponse.call(context);
      });

      it('should have a 422 status code', () =>
        expect(context.res.status).to.be.calledWith(422)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({});
        unprocessableEntityResponse.call(context);
      });

      it('should have a 422 status code', () =>
        expect(context.res.status).to.be.calledWith(422)
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
        unprocessableEntityResponse.call(context);
      });
      it('should have a 422 status code', () =>
        expect(context.res.status).to.be.calledWith(422)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'DELETE';
        getJSONresponse.returns({});
        unprocessableEntityResponse.call(context);
      });
      it('should have a 422 status code', () =>
        expect(context.res.status).to.be.calledWith(422)
      );
    });

  });

});
