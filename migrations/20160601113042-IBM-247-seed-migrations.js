"use strict";
const cps = require('cps');

const id = {
  type: 'int',
  length: 10,
  autoIncrement: true,
  unsigned: true,
  notNull: true,
  primaryKey: true
};

exports.up = (db, callback) =>
  cps.seq([
    (_, callback) => db.createTable('centres', {
      id: id,
      createdAt: 'datetime',
      updatedAt: 'datetime',
      heartbeat_received: 'datetime',
      cid_received_date: 'datetime',
      prebooking_received: 'datetime',
      name: {
        type: 'string',
        unique: true
      },
      male_capacity: 'int',
      female_capacity: 'int',
      male_in_use: 'int',
      female_in_use: 'int',
      male_out_of_commission: 'int',
      female_out_of_commission: 'int',
      male_cid_name: 'longtext',
      female_cid_name: 'longtext'
    }, callback),
    // (_, callback) => db.addIndex('centres', 'name', ['name'], true, callback),
    (_, callback) => db.createTable('detainee', {
      id: id,
      createdAt: 'datetime',
      updatedAt: 'datetime',
      person_id: 'string',
      cid_id: 'int',
      centre: 'int',
      gender: 'string',
      nationality: 'string',
      timestamp: 'datetime',
      originalTimestamp: 'datetime'
    }, callback),
    (_, callback) => db.createTable('event', {
      id: id,
      createdAt: 'datetime',
      updatedAt: 'datetime',
      centre: 'int',
      detainee: 'int',
      operation: 'string',
      timestamp: 'datetime'
    }, callback),
    (_, callback) => db.createTable('heartbeat', {
      id: id,
      createdAt: 'datetime',
      centre: 'int',
      male_in_use: 'int',
      female_in_use: 'int',
      male_out_of_commission: 'int',
      female_out_of_commission: 'int'
    }, callback),
    (_, callback) => db.createTable('movement', {
      id: id,
      createdAt: 'datetime',
      updatedAt: 'datetime',
      timestamp: 'datetime',
      centre: 'int',
      cid_id: 'int',
      direction: 'string',
      gender: 'string',
      active: {
        type: 'tinyint',
        length: 1
      }
    }, callback),
    (_, callback) => db.createTable('prebooking', {
      id: id,
      createdAt: 'datetime',
      updatedAt: 'datetime',
      centre: 'int',
      gender: 'string',
      task_force: 'string',
      cid_id: 'int',
      contingency: {
        type: 'tinyint',
        length: 1
      },
      male_prebooking: 'int',
      female_prebooking: 'int',
      male_contingency: 'int',
      female_contingency: 'int'
    }, callback),
    (_, callback) => db.createTable('subjects', {
      id: id,
      createdAt: 'datetime',
      updatedAt: 'datetime',
      gender: 'string',
      cid_id: 'int'
    }, callback)
  ], callback);

exports.down = (db, callback) =>
  cps.seq([
    (_, callback) => db.dropTable('centres', callback),
    (_, callback) => db.dropTable('detainee', callback),
    (_, callback) => db.dropTable('event', callback),
    (_, callback) => db.dropTable('heartbeat', callback),
    (_, callback) => db.dropTable('movement', callback),
    (_, callback) => db.dropTable('prebooking', callback),
    (_, callback) => db.dropTable('subjects', callback)
  ], callback);
