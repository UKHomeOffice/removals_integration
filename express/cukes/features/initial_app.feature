Feature: Submission of data via the web service

  Scenario: Submission of data via the web service using tables
    Given an individual has checked out at Harmondsworth and the following table of totals are created
      | male | female | ooc_male | ooc_female |
      | 5    | 10     | 3        | 7          |

    Given Harmondsworth has submitted the following table of information regarding their ooc beds
      | male | female | ooc_male | ooc_female |
      | 5    | 10     | 3        | 7          |

    And the following out of commission references and reasons are submitted
      | ref | reference | reason           |
      | 5   | 123       | bed bugs         |
      | 7   | 555       | single occupancy |
      | 9   | 432       | other            |


    When the information is uploaded
    And I navigate to the bed management dashboard

    Then I should see the data on screen


  Scenario: Submission of data via the web service using a csv

    Given the following csv of detention centre totals are created and submitted

    When I navigate to the bed management dashboard

    Then I should see Harmondsworth available male 2 on the screen
    And I should see Harmondsworth available female 4 on the screen
    And I should see Harmondsworth unavailable 5 on the screen

    And I should see Colnbrook available male 6 on the screen
    And I should see Colnbrook available female 1 on the screen
    And I should see Colnbrook unavailable 3 on the screen


    And I should see Campsfield available male 1 on the screen
    And I should see Campsfield available female 2 on the screen
    And I should see Campsfield unavailable 3 on the screen