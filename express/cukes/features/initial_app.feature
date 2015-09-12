Feature: Submission of data via the web service

  Scenario: Submission of data via the web service using tables
    Given an individual has checked in at Harmondsworth on 28-05-2015 at 08:20:30 and the following totals are submitted
    |male | female | ooc_male | ooc_female |
    |5    | 10     | 3        | 7          |
#
#    And the following out of commission reasons are submitted
#
#
#
#
#
#
#    And Harmondsworth submits the following table of departees on 28-05-2015 at 08:20:30
#      | cid_id | nationality | gender | centre        | transferred_to | reason_for_leaving      | transfer_details         |
#      | 1111   | Algeria     | m      | Harmondsworth | null           | Granted leave to remain | Lorem ipsum dolor sit am |
#      | 2222   | Andorra     | m      | Harmondsworth | null           | Removed                 | null                     |
#      | 2222   | Angola      | f      | Harmondsworth | Pennine House  | Transfer to another IRC | null                     |
#
#    And Harmondsworth submits the following table of totals on 28-05-2015 at 08:20:30
#      | male | female | out_of_commission |
#      | 1    | 3      | 2                 |
#
#    When the information is uploaded
#    And I navigate to the bed management dashboard
#
#    Then I should see the data on screen
#
#
#  Scenario: Submission of data via the web service using a csv
#
#    Given the following csv of detention centre totals are created on 28-05-2015 at 08:20:30
#    And the following csv of detention centre arrivals are created on 28-05-2015 at 08:20:30
#    And the following csv of detention centre departees are created on 28-05-2015 at 08:20:30
#
#    When the information is uploaded
#    And I navigate to the bed management dashboard
#
#    Then I should see Harmondsworth available male 2 on the screen
#    And I should see Harmondsworth available female 4 on the screen
#    And I should see Harmondsworth unavailable 5 on the screen
#
#    And I should see Colnbrook available male 6 on the screen
#    And I should see Colnbrook available female 1 on the screen
#    And I should see Colnbrook unavailable 3 on the screen
#
#
#    And I should see Campsfield available male 1 on the screen
#    And I should see Campsfield available female 2 on the screen
#    And I should see Campsfield unavailable 3 on the screen