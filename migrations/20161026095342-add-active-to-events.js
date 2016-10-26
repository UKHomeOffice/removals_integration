'use strict';

exports.up = (db, callback) =>
  db.addColumn(
    'event',
    'active',
    {
      type: 'int',
      length: 1,
      defaultValue: 1
    },
    callback
  );

exports.down = (db, callback) =>
  db.removeColumn('event', 'active', callback);
