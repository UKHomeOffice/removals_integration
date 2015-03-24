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
    Then I should see <value_male> in the "div#harmondsworth div.bed_data span.male" element
    Then I should see <value_female> in the "div#harmondsworth div.bed_data span.female" element
    Then I should see <value_ooc> in the "div#harmondsworth div.bed_data span.ooc" element        
    Examples:
    |value_male|value_female |value_ooc |
    |"0"       |"0"          |"0"       |
    |"0"       |"0"          |"0"       |
    |"1"       |"2"          |"3"       |
    |"1"       |"2"          |"3"       |    
