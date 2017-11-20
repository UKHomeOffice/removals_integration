'use strict';

const cps = require('cps');

exports.up = (db, callback) =>
  cps.seq([
    (_, callback) => db.runSql("CREATE TABLE IF NOT EXISTS detainee_new LIKE detainee", callback),
    (_, callback) => db.runSql("ALTER TABLE detainee_new ADD UNIQUE detainee_unique (person_id, cid_id)", callback),
    (_, callback) => db.runSql("INSERT INTO detainee_new SELECT A.* FROM detainee A WHERE A.id = "
                             + "(SELECT MAX(B.id) FROM detainee B WHERE B.person_id = A.person_id AND B.cid_id = A.cid_id)", callback),
    (_, callback) => db.runSql("UPDATE `event` JOIN detainee ON detainee.id = event.id "
                             + "JOIN detainee_new ON detainee_new.cid_id = detainee.cid_id AND detainee_new.person_id = detainee.person_id "
                             + "SET event.detainee = detainee_new.id;", callback),
    (_, callback) => db.runSql("DROP TABLE detainee", callback),
    (_, callback) => db.runSql("ALTER TABLE detainee_new RENAME TO detainee", callback)
  ], callback);

exports.down = function (db, callback) {
  callback();
};
