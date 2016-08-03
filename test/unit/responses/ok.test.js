'use strict';

const proxyquire = require('proxyquire');
const getJSONresponse = sinon.stub();
const okResponse = proxyquire('../../../api/responses/ok', {
  '../lib/helpers/json-api-response': getJSONresponse
});

describe('UNIT api/responses/ok', () => {
  let context = {
    req: {
      method: '',
      _sails: {
        log: {
          silly: sinon.stub()
        }
      }
    },
    res: {
      status: sinon.stub(),
      jsonx: sinon.stub()
    }
  };

  describe('GET request', () => {
    beforeEach(() => {
      context.req.method = 'GET';
      okResponse.call(context);
    });
    it('should have a 200 status code', () =>
      expect(context.res.status).to.be.calledWith(200)
    );
  });

  describe('POST request', () => {
    beforeEach(() => {
      context.req.method = 'POST';
      okResponse.call(context);
    });
    it('should have a 201 status code', () =>
      expect(context.res.status).to.be.calledWith(201)
    );
  });

  describe('PUT request', () => {

    describe('does return a body' , () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({
          data: 'test'
        });
        okResponse.call(context);
      });

      it('should have a 200 status code', () =>
        expect(context.res.status).to.be.calledWith(200)
      );
    });

    describe('does not return a body' , () => {
      beforeEach(() => {
        context.req.method = 'PUT';
        getJSONresponse.returns({});
        okResponse.call(context);
      });

      it('should have a 204 status code', () =>
        expect(context.res.status).to.be.calledWith(204)
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
        okResponse.call(context);
      });
      it('should have a 200 status code', () =>
        expect(context.res.status).to.be.calledWith(200)
      );
    });

    describe('does not return a body', () => {
      beforeEach(() => {
        context.req.method = 'DELETE';
        getJSONresponse.returns({});
        okResponse.call(context);
      });
      it('should have a 204 status code', () =>
        expect(context.res.status).to.be.calledWith(204)
      );
    });

  });

});
