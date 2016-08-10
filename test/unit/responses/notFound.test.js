'use strict';

const proxyquire = require('proxyquire');
const getJSONresponse = sinon.stub();
const notFoundResponse = proxyquire('../../../api/responses/notFound', {
  '../lib/helpers/json-api-response': getJSONresponse
});

describe('UNIT api/responses/notFound', () => {
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
      notFoundResponse.call(context, 'something');
    });
    it('should have a 404 status code', () =>
      expect(context.res.jsonx).to.be.calledWith(undefined)
    );
  });

  describe('in development provide some help', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      notFoundResponse.call(context, 'something');
    });
    it('should have a 404 status code', () =>
      expect(context.res.jsonx).to.be.calledWith('something')
    );
  });

  describe('GET request', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      notFoundResponse.call(context);
    });
    it('should have a 404 status code', () =>
      expect(context.res.status).to.be.calledWith(404)
    );
  });

  describe('POST request', () => {
    beforeEach(() => {
      context.req.method = 'POST';
      notFoundResponse.call(context);
    });
    it('should have a 404 status code', () =>
      expect(context.res.status).to.be.calledWith(404)
    );
  });

  describe('PUT request', () => {

    describe('does return a body', () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({
          data: 'test'
        });
        notFoundResponse.call(context);
      });

      it('should have a 404 status code', () =>
        expect(context.res.status).to.be.calledWith(404)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({});
        notFoundResponse.call(context);
      });

      it('should have a 404 status code', () =>
        expect(context.res.status).to.be.calledWith(404)
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
        notFoundResponse.call(context);
      });
      it('should have a 404 status code', () =>
        expect(context.res.status).to.be.calledWith(404)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'DELETE';
        getJSONresponse.returns({});
        notFoundResponse.call(context);
      });
      it('should have a 404 status code', () =>
        expect(context.res.status).to.be.calledWith(404)
      );
    });

  });

});
