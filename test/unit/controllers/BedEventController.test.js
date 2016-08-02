describe('INTEGRATION BedEventController', () => {

  it('should be able to the report', () =>
    request(sails.hooks.http.app)
      .get('/bedevent/summary?where={"timestamp":{"lessThan": "2017-01-01T18:25:43.511Z", "greaterThan": "2015-01-23T18:25:43.511Z"}}')
      .expect(200)
      .expect(res => expect(res.body.data).to.eql({
        bigone: {
          female: {
            Other: 2,
            'Maintenance - Health and Safety Concern': 1,
            'Maintenance - Planned works': 1,
            'Crime Scene': 1,
            'Medical Isolation': 1
          },
          male: {'Maintenance - Malicious/Accidental Damage': 1}
        },
        smallone: {male: {'Single Occupancy': 1}}
      }))
  );
});

describe('UNIT BedEventController', () => {
  const controller = rewire("../../api/controllers/BedEventController");
  const centres = [
    {
      id: 1,
      name: "foo"
    },
    {
      id: 2,
      name: "bar"
    }
  ];
  it("countCentresGenderByReason", () =>
    expect(controller.__get__("countCentresGenderByReason")(
      {
        one: {
          m: [
            {reason: "hi"}
          ],
          f: [
            {reason: "hi"},
            {reason: "bi"},
            {reason: "hi"}
          ]
        },
        two: {
          f: [
            {reason: "lo"}
          ]
        }
      })
    ).to.eql({
      one: {
        f: {
          bi: 1,
          hi: 2
        },
        m: {
          hi: 1
        }
      },
      two: {
        f: {
          lo: 1
        }
      }
    }));
  describe("remapToCentreNames", () => {
    beforeEach(() => sinon.stub(Centres, 'find').resolves(centres));
    afterEach(() => Centres.find.restore());

    it("remapToCentreNames", () =>
      expect(controller.__get__("remapToCentreNames")({'1': "foo", '2': "he"})
      ).to.eventually.eql({foo: 'foo', bar: 'he'})
    );

  });

  it("findNameOfCentre", () =>
    expect(controller.__get__("findNameOfCentre")(centres, '2')
    ).to.eql("bar"));

  it("formatBedEvent", () =>
    expect(controller.__get__("formatBedEvent")({
        operation: "foo",
        bed: {
          id: 123,
          centre: "bar",
          gender: "hello"
        },
        id: 199,
        reason: "a reason"
      })
    ).to.eql({
      operation: "foo",
      bed: 123,
      gender: "hello",
      centre: "bar",
      reason: "a reason"
    }));

  it("removeOutOfCommissionsWithInCommissions", () =>
    expect(controller.__get__("removeOutOfCommissionsWithInCommissions")({
        "in commission": [
          {bed: 123}
        ],
        "out commission": [
          {bed: 123},
          {bed: 456}
        ]
      })
    ).to.eql([{bed: 456}]));
})
