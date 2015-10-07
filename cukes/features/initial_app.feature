Feature: Submission of data via the web service

  Scenario: Submission of data via the web service using tables

    Given an individual has checked out at harmondsworth and the following table of totals are created
      | male | female | ooc_male | ooc_female |
      | 6    | 10     | 9        | 2          |

    And the following out of commission references and reasons are submitted
      | ref | reference | reason           | gender |
      | 5   | 123       | bed bugs         | m      |
      | 7   | 555       | single occupancy | f      |
      | 9   | 432       | other            | m      |

    When the information is uploaded
    And I navigate to the bed management dashboard

    Then I should see the data on screen

    Then I should see harmondsworth ooc male 9 on the screen
    And I should see harmondsworth ooc female 2 on the screen
    And I should see colnbrook ooc male 1 on the screen
    And I should see colnbrook ooc female 3 on the screen

  Scenario: Submission of data via the web service using a csv

    Given the following csv of detention centre totals are created and submitted

    When I navigate to the bed management dashboard

    Then I should see harmondsworth occupied male 2 on the screen
    And I should see harmondsworth occupied female 7 on the screen

    Then I should see the data on screen