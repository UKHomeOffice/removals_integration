'use strict';
const _ = require('lodash');
const findAction = require('sails/lib/hooks/blueprints/actions/find');

const formatMaxMinMean = (collection, key) => {
  return {
    max: _.maxBy(collection, key)[key],
    min: _.minBy(collection, key)[key],
    mean: _.meanBy(collection, key)
  };
};

module.exports = {
  _config: {
    populate: true,
    limit: 9223372036854775807
  },
  summary: (req, res) => {
    res.ok = _.wrap(res.ok, (func, matchingRecords) =>
      Promise.all(
        _.map(_.groupBy(matchingRecords, 'centre'), (records, centre) =>
          Centres.findOne(centre)
            .then(foundcentre => {
              return {
                centre: foundcentre.name,
                maleInUse: formatMaxMinMean(records, 'male_in_use'),
                femaleInUse: formatMaxMinMean(records, 'female_in_use'),
                maleOutOfCommission: formatMaxMinMean(records, 'male_out_of_commission'),
                femaleOutOfCommission: formatMaxMinMean(records, 'female_out_of_commission')
              };
            })
        )
      )
        .then(func)
    );
    return findAction(req, res);
  }
};
