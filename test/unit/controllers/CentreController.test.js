var jhg = require('../../helpers/JsonHelperGenerator');
var validation_schema = require('../../../node_modules/removals_dashboard/assets/schema').centre;

describe('INTEGRATION CentreController', () => {
  var centre;

  beforeEach(() => Centre.create({name: _.uniqueId("test")})
      .then(newcentre => centre = newcentre)
  );

  afterEach(() => centre.destroy());

  it('should be able to get a list of all the centres', () =>
      request_auth(sails.hooks.http.app)
        .get('/centre')
        .expect(200)
        .expect(res => expect(res.body.data)
          .to.have.length.at.least(3)
          .and.to.contain.a.thing.with.property('centre_id', 1)
          .and.to.contain.a.thing.with.property('name', 'bigone')
      )
  );

  it('should be able to add a new centre', () =>
      request_auth(sails.hooks.http.app)
        .post('/centre')
        .send()
        .expect(201)
        .expect(res => expect(res.body).to.have.property('centre_id'))
        .toPromise()
        .tap(res => Centre.destroy(res.body.centre_id))
  );

  it('should be able to update an existing centre', () =>
      request_auth(sails.hooks.http.app)
        .post('/centre/' + centre.id)
        .send({name: "renamed"})
        .expect(200)
        .then(() => Centre.findOne(centre.id))
        .then(centre => expect(centre).to.have.property('name', 'renamed'))
  );

  it('should be able to delete an existing centre', () =>
      request_auth(sails.hooks.http.app)
        .del('/centre/' + centre.id)
        .expect(200)
        .then(() => Centre.findOne(centre.id))
        .then(centre => expect(centre).to.be.empty)
  );

});

describe('INTEGRATION CentreController Schema checks', () => {
  it('should provide valid output for a centre', () =>
      request_auth(sails.hooks.http.app)
        .get('/centre/1')
        .expect(200)
        .then(response =>
          expect(RequestValidatorService.validate(response.body.data, validation_schema))
            .to.be.eventually.fulfilled
      )
  );

  it('should provide valid output for centres', () =>
      request_auth(sails.hooks.http.app)
        .get('/centre')
        .expect(200)
        .then(response =>
          Promise.all(_.map(response.body.data, response_body =>
              expect(RequestValidatorService.validate(response_body, validation_schema))
                .to.be.eventually.fulfilled
          ))
      )
  );
});

