'use strict';

const cps = require('cps');
const lodash = require('lodash');
const moment = require('moment');

exports.up = (db, callback) =>
  cps.seq([
    // bedevents
    (_, callback) => db.runSql("ALTER TABLE bedevent DROP INDEX uniqueness", callback),
    (_, callback) => db.runSql("CREATE TABLE bedeventnew LIKE bedevent", callback),
    (_, callback) => db.runSql("ALTER TABLE bedeventnew ADD UNIQUE INDEX uniqueness (bed, timestamp, operation)", callback),
    (_, callback) => db.runSql("INSERT IGNORE INTO bedeventnew SELECT * FROM bedevent", callback),
    (_, callback) => db.runSql("DROP TABLE bedevent", callback),
    (_, callback) => db.runSql("RENAME TABLE bedeventnew TO bedevent", callback),
    (_, callback) => db.runSql('UPDATE bedevent SET active=1 WHERE operation="out commission"', callback),
    (_, callback) => db.runSql('SELECT timestamp, bed FROM bedevent WHERE operation="in commission"', (err, results) => {
      if (err || results.length === 0) {
        return callback(err, results);
      }
      let sqls = [];
      lodash.each(results, result => {
        sqls.push(`(DATE(timestamp) <= "${moment(result.timestamp).format("Y-MM-DD HH:mm:ss")}" AND bed=${result.bed})`);
      });
      db.runSql(`UPDATE bedevent SET active=0 WHERE ${sqls.join(' OR ')}`, callback);
    })

  ], callback);

exports.down = function (db, callback) {
  callback();
};
