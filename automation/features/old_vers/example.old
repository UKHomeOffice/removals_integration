Feature: Drupal.org search
	In order to find modules on Drupal.org
	As a Drupal user
	I need to be able to use Drupal.org search and follow links

 	#@javascript
	Scenario: Searching for "Amar"
		Given I go to "http://drupal.org"
		When I fill in "search_block_form" with "Amar"
		And I press "Search"
		Then I should see "How to make Amare Theme a little wider?"

 	#@javascript
	Scenario Outline: Searching for stuff using variables listed in a table
		Given I go to "http://drupal.org"
		When I type in <value> into the "search_block_form" field
		And I press "Search"
		Then I should see <expected>

		Examples:
        	| value | expected |
    		|  12   |  5  |
    		|  20   |  5  |

 	#@javascript
	Scenario: Test the the link 'Get Started'
		Given I go to "http://drupal.org/home"
		When I follow "Get Started"
		Then I should be on "https://www.drupal.org/start"	

 	#@javascript
	Scenario: Test the the link 'Community'
		Given I go to "http://drupal.org/home"
		When I follow "Community"
		Then I should be on "https://www.drupal.org/community"

 	#@javascript
	Scenario: Test the the link 'Documentation'
		Given I go to "http://drupal.org/home"
		When I follow "Documentation"
		Then I should be on "https://www.drupal.org/documentation"
	
 	#@javascript
	Scenario: Test the the link 'Support'
		Given I go to "http://drupal.org/home"
		When I follow "Support"
		Then I should be on "https://www.drupal.org/support"

 	#@javascript
	Scenario: Test the the link 'Download & Extend'
		Given I go to "http://drupal.org/home"
		When I follow "Download & Extend"
		Then I should be on "https://www.drupal.org/download"

 	#@javascript
	Scenario: Test the the link 'Jobs'
		Given I go to "http://drupal.org/home"
		When I follow "Jobs"
		Then I should be on "https://jobs.drupal.org/"

 	#@javascript
	Scenario: Test the the link 'Marketplace'
		Given I go to "http://drupal.org/home"
		When I follow "Marketplace"
		Then I should be on "https://www.drupal.org/drupal-services"

 	#@javascript
	Scenario: Test the the link 'About'
		Given I go to "http://drupal.org/home"
		When I follow "About"
		Then I should be on "https://www.drupal.org/about"

 	#@javascript
	Scenario: Navigate to Drupal Home Page from the Download page
		Given I go to "http://drupal.org/home"
		When I follow "Download & Extend"
		Then I should be on "https://www.drupal.org/download"
		When I move backward one page
		Then I should be on "http://drupal.org/home"


 	##@javascript
 	Scenario: Select a radio button
		Given I go to "http://drupal.org/home"
		When I fill in "search_block_form" with "Amar"
		And I press "Search"
		Then I should see "How to make Amare Theme a little wider?"
 		When I move backward one page
 		When I check the "edit-meta-type-" radio button
 		Then Radio button with id "edit-meta-type-" should be checked


