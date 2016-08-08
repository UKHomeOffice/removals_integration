'use strict';

const model = rewire('../../api/models/Prebooking');
const Promise = require('bluebird');

describe('UNIT PrebookingModel', () => {
  describe('getPrebookingByCentreGroupByGenderCidOrTaskForce', () => {
    var centreId = 1;
    var contingency = false;
    var getPrebookingsByCentreAndContingencyOutput = [{
      gender: 'male',
      task_force: 'Ops1'
    }, {
      gender: 'male',
      task_force: 'Ops1'
    }, {
      gender: 'male',
      task_force: 'Ops1',
      cid_id: '111'
    }, {
      gender: 'male',
      task_force: 'Ops2',
      cid_id: '222'
    }, {
      gender: 'female',
      task_force: 'Ops1',
      cid_id: '555'
    }, {
      gender: 'female',
      task_force: 'Ops2'
    }];
    var output = {
      male: {
        detail: {
          'Ops1': 2,
          '111': 1,
          '222': 1
        },
        total: 4
      },
      female: {
        detail: {
          '555': 1,
          'Ops2': 1
        },
        total: 2
      }
    };

    beforeEach(() => {
      sinon.stub(Prebooking, 'getPrebookingsByCentreAndContingency').resolves(getPrebookingsByCentreAndContingencyOutput);
    });

    afterEach(() => {
      Prebooking.getPrebookingsByCentreAndContingency.restore()
    });

    it('should return prebookings grouped by gender and count by cid id (if set), alterntatively task force', () =>
      expect(model.getPrebookingByCentreGroupByGenderCidOrTaskForce(centreId, contingency)).to.eventually.deep.equal(output)
    );
  });

  describe('getPrebookingsByCentreAndContingency', () => {
    var centreId = 1;
    var contingency = false;
    var findOutput = [{
      gender: 'male',
      task_force: 'Ops1',
      cid_id: null
    }, {
      gender: 'male',
      task_force: 'Ops1',
      cid_id: void 0
    }, {
      gender: 'male',
      task_force: 'Ops1',
      cid_id: '111'
    }, {
      gender: 'male',
      task_force: 'Ops2',
      cid_id: '222'
    }];
    var output = [{
      gender: 'male',
      task_force: 'Ops1'
    }, {
      gender: 'male',
      task_force: 'Ops1'
    }, {
      gender: 'male',
      task_force: 'Ops1',
      cid_id: '111'
    }, {
      gender: 'male',
      task_force: 'Ops2',
      cid_id: '222'
    }];

    beforeEach(() => {
      sinon.stub(Prebooking, 'find').returns({
        toPromise: sinon.stub().resolves(findOutput)
      })
    });

    afterEach(() => Prebooking.find.restore());

    it('should pass the correct mapping to Prebooking.find', () => {
      model.getPrebookingsByCentreAndContingency(centreId, contingency);
      return expect(Prebooking.find).to.be.calledWith({
        where: {
          centre: centreId,
          contingency: contingency
        },
        select: ['gender', 'task_force', 'cid_id']
      });
    });

    it('should return prebookings where properties of null or undefined are omitted', () =>
      expect(model.getPrebookingsByCentreAndContingency(centreId, contingency)).to.eventually.deep.equal(output)
    );
  });

  describe('unsetTaskForceIfCidIdIsSet', () => {
    it('should return an object exclusive of task_force if cid_id is set', () =>
      expect(model.unsetTaskForceIfCidIdIsSet({
        gender: 'male',
        task_force: 'Ops1',
        cid_id: 1234
      })).to.deep.equal({
        gender: 'male',
        cid_id: 1234
      })
    );
  });

  describe('groupByGender', () => {
    var input = [{
      gender: 'male',
      task_force: 'Ops1'
    }, {
      gender: 'male',
      task_force: 'Ops1'
    }, {
      gender: 'male',
      cid_id: '111'
    }, {
      gender: 'male',
      cid_id: '222'
    }];
    var output = {
      male: [{
        gender: 'male',
        task_force: 'Ops1'
      }, {
        gender: 'male',
        task_force: 'Ops1'
      }, {
        gender: 'male',
        cid_id: '111'
      }, {
        gender: 'male',
        cid_id: '222'
      }]
    };

    it('should return object grouped by gender', () => {
      expect(model.groupByGender(input)).to.deep.equal(output);
    });
  });

  describe('groupAndCountByCidAlternativelyTaskForce', () => {
    var input = {
      male: [{
        gender: 'male',
        task_force: 'Ops1'
      }, {
        gender: 'male',
        task_force: 'Ops1'
      }, {
        gender: 'male',
        cid_id: '111'
      }, {
        gender: 'male',
        cid_id: '222'
      }],
      female: [{
        gender: 'female',
        task_force: 'Ops1'
      }, {
        gender: 'female',
        task_force: 'Ops1'
      }, {
        gender: 'female',
        cid_id: '444'
      }, {
        gender: 'female',
        cid_id: '322'
      }]
    };
    var output = {
      male: {
        detail: {
          'Ops1': 2,
          '111': 1,
          '222': 1
        },
        total: 4
      },
      female: {
        detail: {
          'Ops1': 2,
          '444': 1,
          '322': 1
        },
        total: 4
      }
    };

    it('should return object, where key = value of the cid_id alternatively the task_force attribute and value = count per gender per task_force or cid_id', () => {
      expect(model.groupAndCountByCidAlternativelyTaskForce(input)).to.deep.equal(output);
    });
  });
});

describe('INTEGRATION PrebookingModel', () => {
  it('should get the fixtures', () =>
    expect(Prebooking.find()).to.eventually.have.length(6)
  );
});
