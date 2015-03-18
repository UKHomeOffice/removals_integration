Feature: Let's make some POST calls to RemovalsAPI & see what happens
 As someone who loves and cherishes the RemovalsAPI 
 I want to send data (JSON) to the RemovalsAPI
 So that it will bring smile for behat community

#javascript
Scenario Outline: updating data by sending JSON
    When I post the following JSON to "/update-centres":
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
    Then I should see <expected_male> in the "div#harmondsworth" element
    Then I should see <expected_female> in the "div#harmondsworth" element
    Then I should see <expected_ooc> in the "div#harmondsworth" element        
    Examples:
    | value_male| expected_male         |value_female   |expected_female        | value_ooc | expected_ooc            |
    |  0        | "Available male: 0"   |0              |"Available female: 0"  | 0         |  "Out of commission: 0" |
    |  20       | "Available male: 20"  |100            |"Available female: 100"| 50        |  "Out of commission: 50"|
    |  200      | "Available male: 200" |99             |"Available female: 99" | 12        |  "Out of commission: 12"|