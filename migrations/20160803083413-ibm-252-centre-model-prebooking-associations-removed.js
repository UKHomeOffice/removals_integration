"use strict";

const cps = require('cps');

exports.up = (db, callback) =>
  cps.seq([
    (_, callback) => db.removeColumn('centres', 'male_prebooking', callback),
    (_, callback) => db.removeColumn('centres', 'female_prebooking', callback),
    (_, callback) => db.removeColumn('centres', 'male_contingency', callback),
    (_, callback) => db.removeColumn('centres', 'female_contingency', callback)
  ], callback);

exports.down = (db, callback) =>
  cps.seq([
    (_, callback) => db.addColumn('centres', 'male_prebooking', 'int', callback),
    (_, callback) => db.addColumn('centres', 'female_prebooking', 'int', callback),
    (_, callback) => db.addColumn('centres', 'male_contingency', 'int', callback),
    (_, callback) => db.addColumn('centres', 'female_contingency', 'int', callback)
  ], callback);
