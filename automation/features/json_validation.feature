Feature: Let's validate out JSON file
 As someone who loves and cherishes JASON 
 I want to validate our JSON
 So that it will be accepted by the RemovalAPI

#javascript
Scenario: JSON validation
    Given I load the JSON file "sample_input.json"
    Then the JSON should be valid according to this schema:
    """
{}
    """
	