'use strict';

describe('INTEGRATION RootController', () => {
  it('should return 200 and links', () =>
    request(sails.hooks.http.app)
      .get('/')
      .expect(200)
      .then((res) =>
        expect(res.body.links).to.deep.equal({
          centres: 'http://' + res.req._headers.host + '/centres',
          ports: 'http://' + res.req._headers.host + '/port',
          health: 'http://' + res.req._headers.host + '/health',
          heartbeat: 'http://' + res.req._headers.host + '/heartbeat',
          bedevent: 'http://' + res.req._headers.host + '/bedevent',
          cid_entry: 'http://' + res.req._headers.host + '/cid_entry',
          irc_entry: 'http://' + res.req._headers.host + '/irc_entry',
          depmu_entry: 'http://' + res.req._headers.host + '/depmu_entry',
          self: 'http://' + res.req._headers.host + '/'
        })
      )
  );
  it.only('should return 200 and links', () =>
    request(sails.hooks.http.app)
      .get('/__getcookie')
      .expect(200)
      .then((res) => {
          expect(res.headers['content-type']).to.eql("application/javascript; charset=utf-8")
          expect(res.text).to.eql("_sailsIoJSConnect();")
        }
      )
  )
});
