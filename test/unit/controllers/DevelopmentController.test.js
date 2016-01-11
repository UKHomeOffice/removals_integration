describe('INTEGRATION DevelopmentController', () => {

  it('should be able to get the development page', () =>
      request(sails.hooks.http.app)
        .get('/developments')
        .expect(200)
  );
});
