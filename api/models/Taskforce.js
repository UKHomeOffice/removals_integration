module.exports = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    reservations: {
      collection: 'reservation',
      via: 'taskforce'
    }
  }
}
;

