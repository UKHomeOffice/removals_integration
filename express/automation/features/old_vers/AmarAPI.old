Feature: Let's make some POST calls to RemovalsAPI & see what happens
As a RemovalsAPI tester 
I want to test the RemovalsAPI
So that it will bring smile for behat community
 
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
                    "male" : 200,
                    "female" : 80,
                    "out_of_commission": 10
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
    Then I should see "Available male: 200" in the "div#harmondsworth" element
    Then I should see "Available female: 80" in the "div#harmondsworth" element
    Then I should see "Out of commission: 10" in the "div#harmondsworth" element
    