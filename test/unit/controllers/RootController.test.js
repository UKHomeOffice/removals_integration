'use strict';

describe('INTEGRATION RootController', () =>
  it('should be able to get the root page', () =>
    request(sails.hooks.http.app)
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.body.links)
          .to.have.property('centres')
          .and.equal('/centres')

      })
  )
);
