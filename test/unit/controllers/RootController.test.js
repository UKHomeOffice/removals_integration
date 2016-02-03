'use strict';

describe('INTEGRATION RootController', () =>
  it('should return 200 and links', () =>
    request(sails.hooks.http.app)
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body.links).to.deep.equal({
          centres: 'http://' + res.req._headers.host + '/centres',
          self: 'http://' + res.req._headers.host + '/'
        });
      })
  )
);
