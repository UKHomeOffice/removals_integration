Feature: Let's make some POST calls to RemovalsAPI & see what happens
 As a RemovalsAPI tester
 I want to test the RemovalsAPI
 So that it will bring smile for behat community
 
#Scenario: GitHub behat Demo Api
#  Given I request "/dashboard"
#  Then the response should be JSON
#  And the status code should be 200
#  And the response has a "title" property
#  And the "title" property equals "AmarYeah"

#@javascript
Scenario: updating data by sending JSON
    Given I post the following JSON to "/update-centres":
    """
    {
        "totals" : 
        {
            "date" : "27-2-2015",
            "time" : "08:02:37",
            "bed_counts": 
            {
                "Harmondsworth" : 
                {
                    "male" : 20,
                    "female" : 8,
                    "out_of_commission": 1
                },
                "Brook House" : 
                {
                    "male" : 5,
                    "female" : 0,
                    "out_of_commission": 0
                }
            }
        }
    }
    """
    Then the status code should be 200
    And I go to "http://localhost/dashboard"
    #Then I should see "Available male: 20" in the "div id=colnbrook" element
    Then I click on the element with css selector "div#colnbrook"


    
        