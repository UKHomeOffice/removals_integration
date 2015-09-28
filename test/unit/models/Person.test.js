describe('PersonModel', function () {

  describe('#find()', function () {
    it('should check find function', function (done) {
      Person.find()
        .then(function (results) {
          // some tests
          done();
        })
      //.catch(done);
    });
  });

});
