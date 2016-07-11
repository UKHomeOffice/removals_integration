'use strict';

exports.up = function (db, callback) {
  db.createTable('port', {
    id: {
      type: 'int',
      length: 10,
      autoIncrement: true,
      unsigned: true,
      notNull: true,
      primaryKey: true
    },
    createdAt: 'datetime',
    updatedAt: 'datetime',
    location: 'string'
  }, callback);
};

exports.down = function (db, callback) {
  callback();
};
