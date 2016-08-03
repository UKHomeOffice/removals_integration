'use strict';

const cps = require('cps');

exports.up = (db, callback) =>
  cps.seq([
    // events
    (_, callback) => db.runSql("CREATE TABLE eventnew LIKE event", callback),
    (_, callback) => db.runSql("ALTER TABLE eventnew ADD UNIQUE INDEX uniqueness (centre, detainee, operation, timestamp)", callback),
    (_, callback) => db.runSql("INSERT IGNORE INTO eventnew SELECT * FROM event", callback),
    (_, callback) => db.runSql("DROP TABLE event", callback),
    (_, callback) => db.runSql("RENAME TABLE eventnew TO event", callback),
    // bedevents
    (_, callback) => db.runSql("CREATE TABLE bedeventnew LIKE bedevent", callback),
    (_, callback) => db.runSql("ALTER TABLE bedeventnew ADD UNIQUE INDEX uniqueness (bed, timestamp, detainee, reason)", callback),
    (_, callback) => db.runSql("INSERT IGNORE INTO bedeventnew SELECT * FROM bedevent", callback),
    (_, callback) => db.runSql("DROP TABLE bedevent", callback),
    (_, callback) => db.runSql("RENAME TABLE bedeventnew TO bedevent", callback)
  ], callback);

exports.down = function (db, callback) {
  callback();
};
