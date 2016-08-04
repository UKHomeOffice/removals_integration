'use strict';

exports.up = (db, callback) =>
  db.addColumn(
    'movement',
    'mo_ref',
    {
      type: 'int',
      length: 10
    },
    callback
  );

exports.down = (db, callback) =>
  db.removeColumn('movement', 'mo_ref', callback);
