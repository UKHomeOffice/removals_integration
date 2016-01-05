describe('INTEGRATION HealthController', () => {

  it('should be able to get the healthcheck page', () =>
      request(sails.hooks.http.app)
        .get('/health')
        .expect(200)
  );
});
