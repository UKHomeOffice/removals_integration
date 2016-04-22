'use strict';
var findOneAction = require('sails/lib/hooks/blueprints/actions/findOne');
var findAction = require('sails/lib/hooks/blueprints/actions/find');
var BedCountService = require('../services/BedCountService');

/**
 * CentreController
 *
 * @description :: Server-side logic for managing centres
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: {
    populate: true
  },
  find: function (req, res) {
    let oldOk = res.ok;
    res.ok = (matchingRecords) => {
      Promise.all(
        matchingRecords.map((matchingRecord) => {
          return BedCountService.performConfiguredReconciliation(matchingRecord);
        })
      ).then(() => {
        oldOk(matchingRecords);
      });
    };

    return findAction(req, res);
  },
  findOne: function (req, res) {
    let oldOk = res.ok;
    res.ok = (matchingRecord) => {
      BedCountService.performConfiguredReconciliation(matchingRecord)
        .then(() => {
          oldOk(matchingRecord);
        });
    };

    return findOneAction(req, res);
  }
};
