'use strict';

const ROLE_HEADER = 'x-auth-roles';
const request = require('supertest-as-promised');
const _ = require('lodash');
const UserRoles = require('../../api/services/UserRoles');

const rolesAll = _.keys(UserRoles.permissions);
const defaultRolesAllowed = ['full_access'];

const testRoleAccess = (makeRequest, allowStatusCode, rolesAllowed) => {
  rolesAllowed = defaultRolesAllowed.concat(rolesAllowed);
  const rolesDenied = _.xor(rolesAll.concat(rolesAllowed), rolesAllowed);

  describe('should be accessible by', () => {
    rolesAllowed.forEach((role) => {
      it(role, () => makeRequest(role).expect(allowStatusCode));
    })
  });
  describe('should NOT be accessible by', () => {
    rolesDenied.forEach((role) => {
      it(role, () => makeRequest(role).expect(403));
    })
  });
};

describe('Access Control', () => {
  describe('Cid_EntryController', () => {
    const makeRequest = (role) =>
      request(sails.hooks.http.app)
        .post('/cid_entry/movement')
        .set(ROLE_HEADER, role)
        .send('invalid data');
    const allowStatusCode = 400;
    const rolesAllowed = ['data_cid'];

    testRoleAccess(makeRequest, allowStatusCode, rolesAllowed);
  });
  describe('Irc_EntryController', () => {
    const makeRequest = (role) =>
      request(sails.hooks.http.app)
        .post('/irc_entry/heartbeat')
        .set(ROLE_HEADER, role)
        .send();
    const allowStatusCode = 400;
    const rolesAllowed = ['data_irc'];

    testRoleAccess(makeRequest, allowStatusCode, rolesAllowed);
  });
  describe('CentresController', () => {
    const makeRequest = (role) =>
      request(sails.hooks.http.app)
        .post('/centres')
        .set(ROLE_HEADER, role)
        .send();
    const allowStatusCode = 201;
    const rolesAllowed = [];

    testRoleAccess(makeRequest, allowStatusCode, rolesAllowed);
  });
  describe('HealthController', () => {
    const makeRequest = (role) =>
      request(sails.hooks.http.app)
        .get('/health')
        .set(ROLE_HEADER, role)
        .send();
    const allowStatusCode = 200;
    const rolesAllowed = [];

    testRoleAccess(makeRequest, allowStatusCode, rolesAllowed);
  });
  describe('Depmu_EntryController', () => {
    const makeRequest = (role) =>
      request(sails.hooks.http.app)
        .post('/depmu_entry/prebooking')
        .set(ROLE_HEADER, role)
        .send();
    const allowStatusCode = 400;
    const rolesAllowed = ['data_depmu'];

    testRoleAccess(makeRequest, allowStatusCode, rolesAllowed);
  });
  describe('Depmu_EntryController', () => {
    const makeRequest = (role) =>
      request(sails.hooks.http.app)
        .post('/depmu_entry/prebooking')
        .set(ROLE_HEADER, role)
        .send();
    const allowStatusCode = 400;
    const rolesAllowed = ['data_depmu'];

    testRoleAccess(makeRequest, allowStatusCode, rolesAllowed);
  });
   describe('IRC Read Limitation', () => {
    const makeRequest = (role) =>
      request(sails.hooks.http.app)
        .get('/centres/1')
        .set(ROLE_HEADER, role)
        .send();
    const allowStatusCode = 200;
    const rolesAllowed = ['irc_bigone'];

    testRoleAccess(makeRequest, allowStatusCode, rolesAllowed);
  });

});

