module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false,
    exposedMethods: [
      'index'
    ]
  },

  roomName: 'dashboard',

  index: function (req, res) {
    Centres.find()
      .then(centres => centres)
      .map(this.populateCentre)
      .then(res.ok)
      .tap(() => this.joinDashboardRoom(req, res))
  },

  joinDashboardRoom: function (req, res) {
    if (_.isObject(req.socket)) {
      sails.sockets.join(req.socket, this.roomName)
    }
  },

  broadcastAllCentreUpdates: function () {
    Centres.find()
      .then(centres => centres)
      .map(this.broadcastCentreUpdate)
  },

  broadcastCentreUpdate: function (centre) {
    this.populateCentre(centre)
      .then(centre => sails.sockets.broadcast(this.roomName, centre))
  },

  countMovements: movements => _.countBy(movements, movement => movement.detainee.gender),

  populateCentre: function (centre) {
    return Movement.find({
        active: true,
        centre: centre.id
      })
      .populate('detainee')
      .then(this.countMovements)
      .then(countedMovements => {
        centre.male_movements = countedMovements.male || 0;
        centre.female_movements = countedMovements.female || 0;
        return centre;
      })
  },
};
