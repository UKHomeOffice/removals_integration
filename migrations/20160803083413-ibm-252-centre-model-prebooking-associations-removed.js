"use strict";

const cps = require('cps');

exports.up = (db, callback) =>
  cps.seq([
    (_, callback) => db.removeColumn('centre', 'male_prebooking', callback),
    (_, callback) => db.removeColumn('centre', 'female_prebooking', callback),
    (_, callback) => db.removeColumn('centre', 'male_contingency', callback),
    (_, callback) => db.removeColumn('centre', 'female_contingency', callback)
  ], callback);

exports.down = (db, callback) =>
  cps.seq([
    (_, callback) => db.addColumn('centre', 'male_prebooking', 'int', callback),
    (_, callback) => db.addColumn('centre', 'female_prebooking', 'int', callback),
    (_, callback) => db.addColumn('centre', 'male_contingency', 'int', callback),
    (_, callback) => db.addColumn('centre', 'female_contingency', 'int', callback)
  ], callback);
