Feature: Let's make some POST calls to RemovalsAPI & see what happens
 As someone who loves and cherishes the RemovalsAPI 
 I want to send data (JSON) to the RemovalsAPI
 So that it will bring smile for behat community

Scenario Outline: Populate a Centre with some values and verify the colour 
    When I post the following JSON to "/update-centres":
    """
    {
        "totals" : 
        {
            "date" : "27-02-2015",
            "time" : "08:02:37",
            "bed_counts": 
            {
                "Harmondsworth" : 
                {
                    "male" :  <value_male>,
                    "female" :  <value_female>,
                    "out_of_commission": <value_ooc>
                }                
            }
        }
    }
    """
    Then the status code should be 200
    When I go to "http://localhost/dashboard"
    Then the "#harmondsworth.panel ul.availability li.available span.male" element should contain <value_male>
    Then the "#harmondsworth.panel ul.availability li.available span.female" element should contain <value_female>
    Then the "#harmondsworth.panel ul.availability li.unavailable span.ooc" element should contain <value_ooc> 
    Then I should see an "#harmondsworth.panel" element 
    Examples:
    |value_male|value_female |value_ooc |
    |"1"       |"1"          |"9"       |
    |"7"       |"6"          |"5"       |
     



