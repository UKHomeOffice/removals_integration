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
        'x-auth-roles': 'test1,test2'
      },
      session: {}
    };
    KeycloakMiddleware(req, undefined, () => {
      expect(req.session.permissions).to.deep.equal(['p1', 'p2a', 'p2b']);
    });
  });
  it('should attach empty permissions on missing header', () => {
    const req = {
      headers: {},
      session: {}
    };
    KeycloakMiddleware(req, undefined, () => {
      expect(req.session.permissions).to.deep.equal([]);
    });
  });
});
