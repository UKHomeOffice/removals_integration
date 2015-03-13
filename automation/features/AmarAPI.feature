Feature: Let's make some calls to AmarAPI & se what happens
 As a AmarAPI user
 I want to test AmarAPI
 So that it will bring smile for behat community
 
Scenario: GitHub behat Demo Api
  Given I request "/notes"
  Then the response should be JSON
  And the response status code should be 200
  And the response has a "title" property
  And the "tile" property equals "AmarYeah"
