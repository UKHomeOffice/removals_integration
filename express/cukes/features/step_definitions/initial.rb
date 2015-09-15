Given(/^an individual has checked (.*) at (.*) on (.*) at (.*) and the following table of totals are created/) do |operation, centre, date, time, import_data|
  date= date.to_date
  upload_type='table'
  create_hash(upload_type, import_data, operation, centre, date, time)
end

Given(/^an individual has checked (.*) at (.*) and the following table of totals are created/) do |operation, centre, import_data|
  upload_type='table'
  create_hash(upload_type, import_data, operation, centre)
end

Given(/^(.*) has submitted the following table of information regarding their (.*) beds$/) do |centre, operation, import_data|
  upload_type='table'
  create_hash(upload_type, import_data, operation, centre)
end

Given(/^the following csv of detention centre totals are created and submitted$/) do
  upload_type ='csv'
  import_data = CSVHasher.hashify(DC_data::Locations::TOTALS_CSV)

  create_hash(upload_type, import_data)
end

Then(/^I should see the data on screen$/) do

  location = get_post_centre.downcase

  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.available span.male b.num').text).to eq "#{get_post_bed_counts_male}"
  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.available span.female b.num').text).to eq "#{get_post_bed_counts_female}"
  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{get_post_bed_counts_ooc_male}"
  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{get_post_bed_counts_ooc_female}"

end

Then(/^I should see (.*) available (.*) (\d+) on the screen$/) do |location, gender, total|
  location=location.downcase
  gender=gender.downcase
  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.available span.' + "#{gender}" + ' b.num').text).to eq "#{total}"
end

Then(/^I should see (.*) unavailable (\d+) on the screen$/) do |location, total|
  location=location.downcase
  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{total}"
end

When(/^I navigate to the bed management dashboard$/) do
  visit "#{config('dashboard_host')}" + "#{DC_data::Endpoints::DASHBOARD}"
  expect(page).to have_content ('DEPMU Dashboard')
end

And(/^the information is uploaded$/) do
  create_json
end

And(/^the following out of commission references and reasons are submitted$/) do |import_data|
  assign_ooc_reason(import_data)
end
