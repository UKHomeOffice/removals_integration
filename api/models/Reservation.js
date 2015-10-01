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
    taskforce: {
      type: "string",
      required: true
    },
    male_count: {
      type: "integer",
      defaultsTo: 0,
      required: true
    },
    female_count: {
      type: "integer",
      defaultsTo: 0,
      required: true
    },
    start_date: {
      type: "date",
      required: true
    },
    end_date: {
      type: "date",
      required: true
    },
    centre: {
      model: 'centre',
    }
  },
  beforeCreate: function (values, cb) {
    // @todo: validate that end_date is after start date
    // @todo: validate that start_date is >= 3 days in the future
    cb();
  }
};

