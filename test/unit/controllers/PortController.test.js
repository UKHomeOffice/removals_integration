'use strict';

describe('INTEGRATION PortController', () => {
    it('should be able to get a list of all the ports', () =>
      request(sails.hooks.http.app)
        .get('/port')
        .expect(200)
        .then(res => expect(res.body.data).to.have.length(10))
    );
  }
);
