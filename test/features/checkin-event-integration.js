'use strict';

Feature('Check In Event Integration with Movement Orders', () => {

  "As a DEPMU staff member",
  "when a detainee checks into a IRC",
  "then I want the related movement order count on the Dashboard to be updated",
  "so that the dashboard does not double count a detainee",
  "and that the availability numbers are as accurate as possible."

  before(function () {
      global.overrideSharedBeforeEach = true;
    });

  Scenario('Scheduled count does not include resolved movement orders', () => {

    Given('there is a movement order with cid_id `xx` for the current day', () => {

    });
    When('a valid check in request with cid_id `xx` is made', () => {

    });
    Then('scheduled count does not include the movement order for that cid_id', () => {

    });

  });

  Scenario('Scheduled count does not include unresolved movement orders', () => {

    Given('there is no movement order with cid_id `xx` for the current day', () => {

    });
    Given('a valid check in event request with cid_id `xx` is made', () => {

    });
    Then('the scheduled count is unaffected', () => {

    });

  });
});
