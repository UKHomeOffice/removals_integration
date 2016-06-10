'use strict';

var findOneAction = require('sails/lib/hooks/blueprints/actions/findOne');
var findAction = require('sails/lib/hooks/blueprints/actions/find');
var BedCountService = require('../services/BedCountService');

const hasReadPermissionOnCentre = (permissions, centre) =>
Array.isArray(permissions) && (permissions.indexOf(`centres.${centre.name}.read`) >= 0 || permissions.indexOf('centres.*.read') >= 0);

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
    res.ok = (centres) => {
      const filteredCentres = centres.filter((centre) => hasReadPermissionOnCentre(req.session.permissions, centre));
      return Promise.all(
        filteredCentres.map((centre) => {
          return BedCountService.performConfiguredReconciliation(centre);
        })
      ).then(() => {
        oldOk(filteredCentres);
      });
    };

    return findAction(req, res);
  },
  findOne: function (req, res) {
    let oldOk = res.ok;
    res.ok = (centre) => {
      if (hasReadPermissionOnCentre(req.session.permissions, centre)) {
        return BedCountService.performConfiguredReconciliation(centre)
          .then(() => {
            oldOk(centre);
          });
      }
      res.forbidden();
    };

    return findOneAction(req, res);
  }
};
