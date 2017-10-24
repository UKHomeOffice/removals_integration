'use strict';

describe('INTEGRATION RootController', () =>
  it('should return 200 and links', () =>
    request(sails.hooks.http.app)
      .get('/')
      .expect(200)
      .then((res) =>
        expect(res.body.links).to.deep.equal({
          centres: 'http://' + res.req._headers.host + '/centres',
          health: 'http://' + res.req._headers.host + '/health',
          heartbeat: 'http://' + res.req._headers.host + '/heartbeat',
          bedevent: 'http://' + res.req._headers.host + '/bedevent',
          cid_entry: 'http://' + res.req._headers.host + '/cid_entry',
          irc_entry: 'http://' + res.req._headers.host + '/irc_entry',
          depmu_entry: 'http://' + res.req._headers.host + '/depmu_entry',
          self: 'http://' + res.req._headers.host + '/'
        })
      )
  )
);
