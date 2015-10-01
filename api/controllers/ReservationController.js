module.exports = {

  destroy: function (req, res) {
    var param = req.param('id');
    var reservation = Reservation.findOne(req.param('id'))
      .then(function (reservation) {
        reservation.status = false;
        return reservation.save();
      }).then(res.ok);
  }
};
