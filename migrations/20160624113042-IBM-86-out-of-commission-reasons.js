"use strict";
const cps = require('cps');

exports.up = (db, callback) =>
  cps.seq([
    (_, callback) => db.createTable('bedevent', {
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
      bed: 'int',
      detainee: 'int',
      timestamp: 'datetime',
      operation: 'string',
      reason: 'string',
      active: {
        type: 'tinyint',
        length: 1
      }
    }, callback),
    (_, callback) => db.createTable('bed', {
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
      centre: 'int',
      bed_ref: 'string',
      gender: 'string'
    }, callback)
  ], callback);

exports.down = (db, callback) =>
  cps.seq([
    (_, callback) => db.dropTable('bedevent', callback),
    (_, callback) => db.dropTable('bed', callback)
  ], callback);
