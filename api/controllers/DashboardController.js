/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboard
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise;
Promise = require('bluebird');
module.exports = {

  /**
   * `DashboardController.index()`
   */
  index: function (req, res) {
    return Centre.find()
      .catch(res.serverError)
      .then(res.ok);
  },
};