/* global Centres BedCountService doSomethingWithASummary */
'use strict';

module.exports = {

  example: function () {
    Centres.findOne({})
      .then(BedCountService.getSummary)
      .then(doSomethingWithASummary);
  },
  populateBeds: function (centre, gender) {
    return function (summary) {
      summary[gender].beds.capacity = centre[gender + '_capacity'];
      summary[gender].beds.in_use = centre[gender + '_in_use'];
      return summary;
    };
  },
  populateUnexpected: function (centre, gender) {
    return function (summary) {
      var directionCriteria = {
        in: { operation: 'check in' },
        out: { operation: 'check out' }
      };
      var populateDirection = function (direction) {
        return Centres.findOne({ name: centre.name })
          .populate('events', directionCriteria[direction])
          .then(function (centre) {
            summary[gender].unexpected[direction] = centre.events.length;
            return summary;
          });
      };
      return populateDirection('in')
        .then(populateDirection('out'));
    };
  },

  getSummary: function (centre) {
    return (new Promise(function (resolve) {
      resolve({
        male: {
          beds: {
            capacity: undefined,
            in_use: undefined
          },
          unexpected: { in: undefined, out: undefined }
        },
        female: {
          beds: {
            capacity: undefined,
            in_use: undefined
          },
          unexpected: { in: undefined, out: undefined }
        }
      });
    }))
      .then(this.populateBeds(centre, 'male'))
      .then(this.populateBeds(centre, 'female'))
      .then(this.populateUnexpected(centre, 'male'))
      .then(this.populateUnexpected(centre, 'female'));
  }
};
