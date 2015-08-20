Given(/^(.*) submits the following (.*) of (.*) on (.*) at (.*)$/) do |location, data, type, date, time, table|
  create_hash(location, data, type, date, time, table)
end

Then(/^I should see the data on screen$/) do

  @data.get_info[:totals][:bed_counts].each_key do |dc_centre|
    location = dc_centre.downcase

    expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.available span.male b.num').text).to eq "#{@data.get_info[:totals][:bed_counts][:"#{dc_centre}"][:male]}"
    expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.available span.female b.num').text).to eq "#{@data.get_info[:totals][:bed_counts][:"#{dc_centre}"][:female]}"
    expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{@data.get_info[:totals][:bed_counts][:"#{dc_centre}"][:out_of_commission]}"
  end
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


Given(/^the following (.*) of detention centre (.*) are created on (.*) at (.*)$/) do |data, type, date, time|
  require 'csv_hasher'

  location = nil

  case type
    when 'totals'
      array = CSVHasher.hashify(DC_data::Locations::TOTALS_CSV)
    when 'arrivals'
      array = CSVHasher.hashify(DC_data::Locations::ARRIVALS_CSV)
    when 'departees'
      array = CSVHasher.hashify(DC_data::Locations::DEPARTEES_CSV)
  end

  create_hash(location, data, type, date, time, array)
end