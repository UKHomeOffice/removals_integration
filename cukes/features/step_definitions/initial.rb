Given(/^an individual has checked (\D+) at (\D+) on (.*) at (.*) and the following table of totals are created/) do |operation, centre, date, time, import_data|
  date= date.to_date
  upload_type='table'
  create_submission(import_data, {:upload_type => upload_type, :operation => operation, :centre => centre, :date => date, :time => time})
end

Given(/^an individual has checked (\D+) at (\D+) and the following table of totals are created/) do |operation, centre, import_data|
  upload_type='table'
  create_submission(import_data, {:upload_type => upload_type, :operation => operation, :centre => centre})
end

Given(/^(\D+) has submitted the following table of information regarding their (\D+) beds$/) do |centre, operation, import_data|
  upload_type='table'
  create_submission(import_data, {:upload_type => upload_type, :operation => operation, :centre => centre})
end

Given(/^the following csv of detention centre totals are created and submitted$/) do
  upload_type ='csv'
  import_data = CSVHasher.hashify(DC_data::Config::Locations::TOTALS_CSV)

  create_submission(import_data, {:upload_type => upload_type})
end

Then(/^I should see the data on screen$/) do
  confirm_uploaded_data
end

Then(/^I should see the data from the csv on screen$/) do
  import_data = CSVHasher.hashify(DC_data::Config::Locations::TOTALS_CSV)
  confirm_uploaded_data(:import_data => import_data)
end

Then(/^I should see (.*) available (.*) (\d+) on the screen$/) do |centre, gender, total|
  centre=centre.downcase
  gender=gender.downcase
  confirm_uploaded_data(:centre => centre, :gender => gender, :total => total)
end

Then(/^I should see (.*) unavailable (\d+) on the screen$/) do |centre, total|
  centre=centre.downcase
  confirm_uploaded_data(:centre => centre, :total => total)
end

When(/^I navigate to the bed management dashboard$/) do
  visit "#{config('dashboard_host')}" + "#{DC_data::Config::Endpoints::DASHBOARD}"
  expect(page).to have_content ('DEPMU Dashboard')
end

And(/^the information is uploaded$/) do
  post_data_to_api
end

And(/^the following out of commission references and reasons are submitted$/) do |import_data|
  create_ooc_reasons(import_data)
end
