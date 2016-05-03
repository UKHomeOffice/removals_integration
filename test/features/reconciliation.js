'use strict';

Feature('Event/Movement Order Reconciliation', () => {
  describe('Detainee without Movement Order (Unexpected Checkin)', () => {

    Given('a Movement Order for centre `abc` with CID `1234` does not exist', () => {

    });

    And('the centre `abc` has a Scheduled In count of Zero', () => {

    });

    And('the Unexpected in count for centre `abc` is 0', () => {

    });
    When('a Detainee for centre `abc` with CID `1234` becomes present', () => {

    });
    Then('the Scheduled In count for the centre `abc` must be Zero', () => {

    });
    And('the Unexpected in count for centre `abc` must be One', () => {

    });

  });
});
