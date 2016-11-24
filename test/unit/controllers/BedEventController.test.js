describe('INTEGRATION BedEventController', () => {

  it('should be able to the summary report', () =>
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

  it('should be able to the people report', () =>
    request(sails.hooks.http.app)
      .get('/bedevent/detainees?where={"timestamp":{"lessThan": "2017-01-01T18:25:43.511Z", "greaterThan": "2016-02-26T03:51:27.000Z"}}')
      .expect(200)
      .expect(res => expect(res.body.data).to.eql({
        bigone: [
          {
            centre: 1,
            centre_person_id: "99999",
            cid_id: 1244234,
            gender: "male",
            nationality: "gbr",
            operation: "check in",
            timestamp: "2016-02-26T09:24:20.000Z"
          },
          {
            centre: 1,
            centre_person_id: "111111",
            cid_id: 4534533,
            gender: "female",
            nationality: "fra",
            operation: "reinstatement",
            timestamp: "2016-02-26T09:24:20.000Z"
          },
          {
            centre: 1,
            centre_person_id: "99999",
            cid_id: 1244234,
            gender: "male",
            nationality: "gbr",
            operation: "check out",
            timestamp: "2016-02-27T10:31:18.000Z"
          },
        ],
        smallone: [
          {
            centre: 2,
            centre_person_id: "3333333",
            cid_id: 234234534,
            gender: "female",
            nationality: "swe",
            operation: "check out",
            timestamp: "2016-02-26T12:51:22.000Z"
          }
        ]
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

  it("formatDetaineeEvent", () =>
    expect(controller.__get__("formatDetaineeEvent")({
        timestamp: "foo",
        centre: "foo",
        detainee: {
          cid_id: "ba",
          gender: "mad",
          nationality: "too",
          person_id: "soo"
        },
        operation: 'som',
        id: 199
      })
    ).to.eql({
      centre: "foo",
      centre_person_id: "soo",
      cid_id: "ba",
      gender: "mad",
      nationality: "too",
      operation: "som",
      timestamp: "foo"
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
