'use strict';

Feature('Check In Event', () => {

  Scenario('Non-Existent Event should be Created', () => {

    Given('a check in event from centre `abc` relating to person id `xx` has not already occurred', () => {
      // check that an event from centre `abc` relating to a detainee with person_id `xx` does not exist
    });
    When('a valid check in event from centre `abc` with person id `xx` occurs', () => {
      // trigger a check in event with a payload
    });
    Then('an event relating to detainee with person id `abc_xx` is created from the check in event received', () => {
      // check that an event relating to detainee `abc_xx` exists
    });

  });

  Scenario('Event should be created', () => {

    Given('a check in event from centre `abc` relating to person id `xx` has already occurred', () => {
      // trigger a check in event from centre `abc` relating to a detainee with person_id `xx`
    });
    When('a valid check in event with person id `xx` occurs', () => {
      // trigger a check in event with a payload
    });
    Then('an event relating to person id `abc_xx` should be created from the check in received', () => {
      // check that an event relating to detainee `abc_xx` has been created
    });

  });

  Scenario('Non-Existent Detainee Should be Created', () => {

    Given('a detainee with the person id `abc_xx` does not already exist', () => {
      // check that no detainee model with person_id `xx` exists
    });
    When('a valid check in event from centre `abc` with person id `xx` occurs', () => {
      // trigger a check in event with a payload
    });
    Then('a detainee with person id `abc_xx` is created from the check in event received', () => {
      // check that a detainee exists and that the detainee properties are as expected
    });

  });

  Scenario('Existing Detainee Should Updated', () => {

    Given('a detainee with the person id `abc_xx` already exists', () => {
      // Create a detainee model with person_id `abc_xx`
    });
    And('the time of the event timestamp is later than the existing detainee update timestamp', () => {
      // Update the detainee model person_id `abc_xx` to ensure the timestamp is < event timestamp
    });
    When('a valid check in event from centre `abc` with person id `xx` occurs', () => {
      // trigger a check in event with a payload
    });
    Then('the existing detainee with person id `abc_xx` is updated from the check in event received', () => {
      // check that the existing detainee properties now match the check in event detainee properties
    });

  });

  Scenario('Existing Detainee Should Not Be Updated', () => {

    Given('a detainee with the person id `abc_xx` already exists', () => {
      // Create a detainee model with person_id `abc_xx`
    });
    And('the time of the existing detainee update timestamp is later than the event timestamp', () => {
      // Update the detainee model person_id `abc_xx` to ensure the timestamp is > event timestamp
    });
    When('a valid check in event with from centre `abc` and person id `xx` occurs', () => {
      // trigger a check in event with a payload
    });
    Then('the existing detainee with person id `abc_xx` should not be updated from the event received', () => {
      // check that the existing detainee properties remain the same
    });

  });
});

Feature('Check In Event Integration with Movement Orders', () => {

  "As a DEPMU staff member",
  "when a detainee checks into a IRC",
  "then I want the related movement order count on the Dashboard to be updated",
  "so that the dashboard does not double count a detainee",
  "and that the availability numbers are as accurate as possible."

  Scenario('Scheduled count does not include resolved movement orders', () => {

    Given('there is a movement order with cid_id `xx` for the current day', () => {});
    When('a valid check in request with cid_id `xx` is made', () => {});
    Then('scheduled count does not include the movement order for that cid_id', () => {});

  });

  Scenario('Scheduled count does not include unresolved movement orders', () => {

    Given('there is no movement order with cid_id `xx` for the current day', () => {});
    Given('a valid check in event request with cid_id `xx` is made', () => {});
    Then('Then the scheduled count is unaffected', () => {});

  });
});
