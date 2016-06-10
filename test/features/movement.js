
Feature('Movements', () => {

  const centre = {
    name: 'bigone',
    male_capacity: 999,
    female_capacity: 750,
    id: 1,
    male_cid_name: ['bigone male holding', 'smallone male holding'],
    female_cid_name: ['bigone female office', 'smallone female holding']
  };
  const randomInt = () => Math.floor(Math.random() * 100000) + 1000;
  const validMovementTimestamp = moment().set({hour: 7, minute: 0, second: 0}).format('DD/MM/YYYY HH:mm:ss');
  const movement = (direction, cid) => ({
    Output: [{
      Location: 'bigone male holding',
      'MO In/MO Out': direction,
      'MO Ref.': `${randomInt()}`,
      'MO Date': validMovementTimestamp,
      'MO Type': 'Occupancy',
      'CID Person ID': `${cid || randomInt()}`
    }]
  });

  Scenario('for today', () => {
    Scenario('an update with a movement in should show up as an `expected in` and reduce the availability', function () {
      before(function () {
        testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And('it has no movements', () => expect(Movement.find({})).to.eventually.be.empty);

      When('a movement in is added', () => {
        this.cid = 123
        return createRequest(movement('In', this.cid), '/cid_entry/movement', 201)
          .then(() => expect(Movement.find({})).to.eventually.have.lengthOf(1))
      });

      Then('the movement should appear in the centre\'s `expected in` list', () =>
        Centres.getGenderAndCentreByCIDLocation('bigone male holding')
          .then(o => Centres.findReconciled(o.centre))
          .then(centre => this.centreDetail = centre[0].toJSON())
          .tap(json => expect(json).to.have.deep.property('attributes.maleExpectedIn')
            .that.is.an('array').that.has.lengthOf(1)
            .with.deep.property('[0].cid_id', this.cid))
      );

      And('the centre\'s `availability` count should be reduced', () =>
        expect(this.centreDetail.attributes.maleAvailability).to.equal(this.centreDetail.attributes.maleCapacity - 1)
      );

    });
  });

});
