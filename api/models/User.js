module.exports = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    userid: {
      type: "string",
      required: true,
      primaryKey: true,
      notNull: true
    }
  }
};
