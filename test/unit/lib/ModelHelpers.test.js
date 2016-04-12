var helpers = require('../../../api/lib/ModelHelpers');
describe('Model Helpers', () => {
  var model;
  before(() => {
    model = {};
    helpers.mixin(model);
  });

  describe('findAndUpdateOrCreate', () => {
    beforeEach(() => {
      model.update = sinon.stub().resolves(['foba']);
      model.create = sinon.stub().resolves('created');
    });

    it('should pass the params to update', () =>
      model.findAndUpdateOrCreate('foo', 'bar')
        .then(() =>
          expect(model.update).to.be.calledWith('foo', 'bar')
        ));

    it('should return the first result if is one', () =>
      model.findAndUpdateOrCreate('foo', 'bar')
        .then(result =>
          expect(result).to.eql('foba')
        ));

    it('should not run create if there is a match', () =>
      model.findAndUpdateOrCreate('foo', 'bar')
        .then(() =>
          expect(model.create).to.not.be.called
        ));

    it('should return a create for the values if there is no result', () => {
      model.update = sinon.stub().resolves([]);
      model.findAndUpdateOrCreate('foo', 'bar')
        .then(() =>
          expect(model.create).to.have.been.calledWith('bar')
        );
    });
  });

  describe('mixin', () => {
    it('should mix in to a model', () =>
      expect(model).to.include.keys(_.without(_.keys(helpers), 'mixin'))
    );
    it('should not mix in the mixin method', () =>
      expect(model).to.not.include.key('mixin')
    );
  })
})

