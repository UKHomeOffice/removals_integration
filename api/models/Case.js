module.exports = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    case_id: {
      type: 'integer',
      required: true,
      primaryKey: true,
      unique: true
    },
    reservations: {
      collection: 'reservation',
      via: 'case'
    }
  }
};

