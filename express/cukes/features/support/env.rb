require 'rspec/expectations'
require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'faraday_middleware'
require 'date'
require 'active_support/all'
require 'selenium-webdriver'



if ENV['IN_BROWSER']
  # On demand: non-headless tests via Selenium/WebDriver
  # To run the scenarios in browser (default: Firefox), use the following command line:
  # IN_BROWSER=true bundle exec cucumber
  # or (to have a pause of 1 second between each step):
  # IN_BROWSER=true PAUSE=1 bundle exec cucumber
  Capybara.default_driver = :selenium
  puts "#######RUNNING IN BROWSER########"
  Capybara.register_driver :selenium do |app|
    profile = Selenium::WebDriver::Firefox::Profile.new
    profile['browser.helperApps.alwaysAsk.force'] = false
    profile['browser.cache.disk.enable'] = false
    profile['browser.cache.memory.enable'] = false
    Capybara::Selenium::Driver.new(app, :browser => :firefox, :profile => profile)

    # AfterStep do
    #   sleep (ENV['PAUSE'] || 0).to_i
    # end
  end

else
  # DEFAULT: headless tests with poltergeist/PhantomJS
  Capybara.register_driver :poltergeist do |app|
    Capybara::Poltergeist::Driver.new(
        app,
        window_size: [1280, 1024],
        phantomjs_options: ['--ignore-ssl-errors=true', '--ssl-protocol=tlsv1'],
        js_errors: false,
        #debug: true,
        timeout: 60,
    )
  end
  Capybara.default_driver    = :poltergeist
  Capybara.javascript_driver = :poltergeist

end

Capybara.default_selector = :css
World(RSpec::Matchers)

config_file = ENV['CONFIG_FILE'] || "#{File.dirname(__FILE__)}/config.yml"
$app_config = YAML.load_file(config_file)

def config(key)
  $app_config[key]
end


def dashboard_api
  @dashboard_api = Faraday.new(:url => config('dashboard_host')) do |faraday|
    #faraday.response :logger
    faraday.response :json, :content_type => /\bjson$/
    faraday.use Faraday::Adapter::NetHttp
    faraday.use FaradayMiddleware::ParseJson
  end
end