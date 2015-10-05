/**
 * WallboardController
 *
 * @description :: Server-side logic for managing wallboard
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `WallboardController.index()`
   */
  index: function (req, res) {
    return Centre.find()
      .catch(res.serverError)
      .map(function (centre) {
        return {
          name: centre.name,
          centre_id: centre.id,
          male_capacity: centre.male_capacity,
          male_available: centre.male_capacity - centre.male_in_use - centre.male_out_of_commission,
          female_capacity: centre.female_capacity,
          female_available: centre.female_capacity - centre.female_in_use - centre.female_out_of_commission,
          booked: 0,
          reserved: 0
        };
      })
      .then(res.ok);
  },
};
