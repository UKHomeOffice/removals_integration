<?php
 
use Behat\Behat\Context\ClosuredContextInterface,
    Behat\Behat\Context\TranslatedContextInterface,
    Behat\Behat\Context\BehatContext,
    Behat\Behat\Exception\PendingException;
use Behat\Gherkin\Node\PyStringNode,
    Behat\Gherkin\Node\TableNode;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpKernel\KernelInterface;
use Behat\Symfony2Extension\Context\KernelAwareInterface;
use Behat\MinkExtension\Context\MinkContext;
use GuzzleHttp\Client;  
use behatch\contexts;

 
#class FeatureContext extends BehatContext
class FeatureContext extends MinkContext implements KernelAwareInterface 
{
    public $_response;
    public $_client;
    private $_parameters = array();
    
    /**
     * Initializes context.
     * Every scenario gets it's own context object.
     *
     * @param   array   $parameters     context parameters (set them up through behat.yml)
     */
    public function __construct(array $parameters)
    {
 
        $this->_parameters = $parameters;
        $baseUrl = $this->getParameter('base_url');
        $client = new Client(['base_url' => $baseUrl]);
        $this->_client = $client;
        $client->setDefaultOption('verify', false);
    }
 
    /**
     * @When /^wait (\d+) seconds?$/
     */
    public function waitSeconds($seconds)
    {
        sleep($seconds);
    }
 
    public function getParameter($name)
    {
        if (count($this->_parameters) === 0) 
        {
            throw new \Exception('Parameters not loaded!');
        } 
        else 
        {
            $parameters = $this->_parameters;
            return (isset($parameters[$name])) ? $parameters[$name] : null;
        }
    }

    /**
     * @Given /^I load the JSON file "([^"]*)"$/
     */
    public function iLoadTheJsonFile($arg1)
    {
        $file = file_get_contents($arg1, FILE_USE_INCLUDE_PATH);
        return $file;
    }

    /**
     * @Given /^I post the following JSON to "([^"]*)":$/
     */
    public function iPostTheFollowingJsonToTheApi($uri, PyStringNode $JSON)
    {
        $request = $this->_client->post($uri, ["body"=> $JSON,"headers"=>['Content-Type'=>'application/json']]);
        $this->_response = $request;
    }

    /**
     * @When /^I request "([^"]*)"$/
     */
    public function iRequest($uri)
    {
        $request = $this->_client->get($uri);
        $this->_response = $request;
    }
 
    /**
     * @Then /^the response should be JSON$/
     */
    public function theResponseShouldBeJson()
    {
        $data = json_decode($this->_response->getBody(true));
        if (empty($data)) { throw new Exception("Response was not JSON\n" . $this->_response);
       }
    }
 
  	/**
 	  * @Given /^the status code should be (\d+)$/
 	  */
	 public function theStatusCodeShouldBe($httpStatus)
	 {
      if ((string)$this->_response->getStatusCode() !== $httpStatus) 
      {
        throw new \Exception('HTTP code does not match '.$httpStatus.
                ' (actual: '.$this->_response->getStatusCode().')');
		  }
	 }

    /**
     * @Given /^the response has a "([^"]*)" property$/
     */
    public function theResponseHasAProperty($propertyName)
    {
        $data = json_decode($this->_response->getBody(true));
        if (!empty($data)) 
        {
            if (!isset($data->$propertyName)) 
            {
                throw new Exception("Property '".$propertyName."' is not set!\n");
            }
        } 
        else 
        {
            throw new Exception("Response was not JSON\n" . $this->_response->getBody(true));
        }
    }

    /**
    * @Then /^the "([^"]*)" property equals "([^"]*)"$/
    */
    public function thePropertyEquals($propertyName, $propertyValue)
    {
        $data = json_decode($this->_response->getBody(true));
 
        if (!empty($data)) {
            if (!isset($data->$propertyName)) 
            {
                throw new Exception("Property '".$propertyName."' is not set!\n");
            }
            if ($data->$propertyName !== $propertyValue) 
            {
                throw new \Exception('Property value mismatch! (given: '.$propertyValue.', match: '.$data->$propertyName.')');
            }
        } 
        else 
        {
            throw new Exception("Response was not JSON\n" . $this->_response->getBody(true));
        }
    }

	  /**
    * Sets HttpKernel instance.
    * This method will be automatically called by Symfony2Extension ContextInitializer.
    *
    * @param KernelInterface $kernel
    */
  	public function setKernel(KernelInterface $kernel) 
  	{
    	$this->kernel = $kernel;
  	}

    /**
     * @When /^I type in (\d+) into the "([^"]*)" field$/
     */
    public function iTypeInIntoTheField($value, $field)
    {
        $field = $this->fixStepArgument($field);
        $value = $this->fixStepArgument($value);
        $this->getSession()->getPage()->fillField($field, $value);
    }

    /**
     * @Then /^I should see (\d+)$/
     */
    public function iShouldSee($text)
    {
        $this->assertSession()->pageTextContains($this->fixStepArgument($text));
    }

  	/**
  	* @When /^I check the "([^"]*)" radio button$/
  	*/
  	public function iCheckTheRadioButton($radioLabel)
  	{
      $radioButton = $this->getSession()->getPage()->findField($radioLabel);
      if (null === $radioButton) 
      {
        throw new Exception('Cannot find radio button '.$radioLabel);
  		}
    	$value = $radioButton->getAttribute('value');
    	$this->getSession()->getDriver()->click($radioButton->getXPath());
	  }

  	/**
  	* @Then /^Radio button with id "([^"]*)" should be checked$/
  	*/
  	public function RadioButtonWithIdShouldBeChecked($sId)
  	{
    	$elementByCss = $this->getSession()->getPage()->find('css', 'input[type="radio"]:checked#'.$sId);
    	if (!$elementByCss) 
    	{
        throw new Exception('Radio button with id ' . $sId.' is not checked');
    	}
  	}
}
