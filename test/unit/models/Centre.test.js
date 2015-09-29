describe('CentreModel', function () {

  describe('#find()', function () {
    it('should check find function', function (done) {
      Centre.find()
        .then(function (results) {
          // some tests
          done();
        })
      //.catch(done);
    });
  });

});
