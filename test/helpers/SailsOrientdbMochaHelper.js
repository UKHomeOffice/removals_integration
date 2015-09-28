var SailsOrientdbMochaHelper;

SailsOrientdbMochaHelper = function (chai, utils) {
  var Assertion;
  Assertion = chai.Assertion;
  utils.addProperty(Assertion.prototype, 'model', function () {
    return this.assert(typeof this._obj === 'object', 'expected #{this} to be a Model but got #{act}', 'expected #{this} to not be a Model', typeof this._obj);
  });
  utils.addProperty(Assertion.prototype, 'vertex', function () {
    return this.assert(this._obj.orientdbClass === void 0 || (this._obj.orientdbClass != null) === 'V', 'expected #{this} to be a Vertex ', 'expected #{this} to not be a Vertex');
  });
  return utils.addProperty(Assertion.prototype, 'edge', function () {
    return this.assert(this._obj.orientdbClass === 'E', 'expected #{this} to be an Edge ', 'expected #{this} to not be a Edge');
  });
};

module.exports = SailsOrientdbMochaHelper;