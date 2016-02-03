'use strict';

var Validator = require('jsonapi-validator').Validator;
var validator = new Validator();

describe('INTEGRATION CentreController', () => {
    var centre;

    beforeEach(() => Centres.create({name: _.uniqueId("test")})
        .then(newcentre => centre = newcentre)
    );

    afterEach(() => centre.destroy());

    it('should be able to get a list of all the centres', () =>
      request(sails.hooks.http.app)
        .get('/centres')
        .expect(200)
        .expect(res => {
          expect(res.body.data)
            .to.have.length.at.least(3)

          expect(res.body.data)
            .to.contain.a.thing.with.property('id', '1')
            .and.to.contain.a.thing.with.property('attributes')


        }
      ));

    it('should be able to add a new centre', () =>
        request_auth(sails.hooks.http.app)
          .post('/centres')
          .send()
          .expect(201)
          .expect(res => expect(res.body).to.have.property('id'))
          .toPromise()
          .tap(res => Centres.destroy(res.body.id))
    );

    it('should be able to update an existing centre', () =>
        request_auth(sails.hooks.http.app)
          .put('/centres/' + centre.id)
          .send({name: "renamed"})
          .expect(200)
          .then(() => Centres.findOne(centre.id))
          .then(centre => expect(centre).to.have.property('name', 'renamed'))
    );

    it('should be able to delete an existing centre', () =>
        request_auth(sails.hooks.http.app)
          .del('/centres/' + centre.id)
          .expect(200)
          .then(() => Centres.findOne(centre.id))
          .then(centre => expect(centre).to.be.empty)
    );
  }
);

describe('INTEGRATION CentreController Schema checks', () => {
  it('should provide valid output for a centre', () =>
      request(sails.hooks.http.app)
        .get('/centres/1')
        .expect(200)
        .then(response => expect(validator.isValid(response.body)).to.be.true
      )
  );

  it('should provide valid output for centres', () =>
      request(sails.hooks.http.app)
        .get('/centres')
        .expect(200)
        .then(response =>
          expect(validator.isValid(response.body)).to.be.true
      )
  );
});
