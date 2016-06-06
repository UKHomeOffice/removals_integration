var UserRoles = require('../../../api/services/UserRoles');
var KeycloakMiddleware = require('../../../api/middlewares/Keycloak');

describe('Keycloak Middleware', () => {
  const origPermissions = UserRoles.permissions;
  beforeEach(() => {
    UserRoles.permissions = {
      test1: ['p1'],
      test2: ['p2a', 'p2b'],
      test3: ['p2a', 'p2b']
    };
  });
  afterEach(() => {
    UserRoles.permissions = origPermissions;
  });
  it('should attach permissions to request', () => {
    const req = {
      headers : {
        'X-Auth-Roles': 'test1,test2'
      }
    };
    KeycloakMiddleware(req, undefined, () => {
      expect(req.permissions).to.deep.equal(['p1', 'p2a', 'p2b']);
    });
  });
  it('should attach empty permissions on missing header', () => {
    const req = {
      headers : {}
    };
    KeycloakMiddleware(req, undefined, () => {
      expect(req.permissions).to.deep.equal([]);
    });
  });
});
