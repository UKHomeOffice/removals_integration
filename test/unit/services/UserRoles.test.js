var UserRoles = require('../../../api/services/UserRoles');

describe('UserRoles', () => {

  describe('getPermissions', () => {
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

    it('should return an array of permissions', () => {
      const role = 'test1';
      const result = UserRoles.getPermissions(role);
      expect(result).to.deep.equal(['p1']);
    });
    it('should accept an array of roles', () => {
      const role = ['test1'];
      const result = UserRoles.getPermissions(role);
      expect(result).to.deep.equal(['p1']);
    });
    it('should return permissions for multiple roles', () => {
      const role = ['test1', 'test2'];
      const result = UserRoles.getPermissions(role);
      expect(result).to.deep.equal(['p1', 'p2a', 'p2b']);
    });
    it('should return unique set of permissions', () => {
      const role = ['test2', 'test3'];
      const result = UserRoles.getPermissions(role);
      expect(result).to.deep.equal(['p2a', 'p2b']);
    });
    it('should not add undefined if the role does not exist', () => {
      const role = ['role does not exist'];
      const result = UserRoles.getPermissions(role);
      expect(result).to.deep.equal([]);
    });
  });
});
