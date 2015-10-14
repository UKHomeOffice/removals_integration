describe('ReservationController', function () {
  it('should be able to get a listing of reservations', function () {
    return request(sails.hooks.http.app)
      .get('/Reservation')
      .expect(200)
      .expect(function (res) {
        return expect(res.body).to.have.length(6);
      });
  });
  it('should be able to get a single reservation', function () {
    return request(sails.hooks.http.app)
      .get('/Reservation/1')
      .expect(200);
  });

  it('should set the status to false when deleting a reservation', function () {
    return request(sails.hooks.http.app)
      .delete('/Reservation/1')
      .expect(200)
      .then(function (res) {
        return request(sails.hooks.http.app)
          .get('/Reservation/1')
          .expect(200)
          .expect(function (res) {
            return expect(res.body).to.contain({
              status: false
            });
          });
      });
  });
});
