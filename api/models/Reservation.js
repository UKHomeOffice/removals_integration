var moment = require('moment');

module.exports = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    status: {
      type: "boolean",
      defaultsTo: true,
      required: true
    },
    expiry: {
      type: 'datetime',
      required: true,
      defaultsTo: function () {
        return moment().add(1, 'day').toDate();
      }
    },
    taskforce: {
      model: 'taskforce'
    },
    case: {
      model: 'case'
    },
    centre: {
      model: 'centre'
    },
    required_male: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },
    required_female: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    }
  }
};
