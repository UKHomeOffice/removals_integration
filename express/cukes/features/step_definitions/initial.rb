Given(/^an individual has checked (.*) at (.*) on (.*) at (.*) and the following table of totals are submitted$/) do |operation, centre, date, time, table|
  date= date.to_date
  upload_type='table'
  create_hash(operation, centre, date, time, upload_type, table)
end

Given(/^an individual has checked (.*) at (.*) and the following table of totals are submitted$/) do |operation, centre, table|
  date=get_date
  time =get_time
  upload_type='table'
  create_hash(operation, centre, date, time, upload_type, table)
end

Then(/^I should see the data on screen$/) do

  location = @data.get_info[:centre].downcase

  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.available span.male b.num').text).to eq "#{@data.get_info[:totals][:bed_counts][:male]}"
  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.available span.female b.num').text).to eq "#{@data.get_info[:totals][:bed_counts][:female]}"
  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{@data.get_info[:totals][:bed_counts][:out_of_commission][:ooc_male]}"
  expect(page.find(:css, '#' + "#{location}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{@data.get_info[:totals][:bed_counts][:out_of_commission][:ooc_female]}"

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
  visit "#{config('dashboard_host')}" + "#{DC_data::Endpoints::DA SHBOARD}"
  expect(page).to have_content ('DEPMU Dashboard')
end

And(/^the information is uploaded$/) do
  create_json
end

Given(/^the following csv of detention centre totals are created and submitted$/) do
  require 'csv_hasher'

  centre=nil
  operation =nil
  date=nil
  time=nil
  upload_type ='csv'
  array = CSVHasher.hashify(DC_data::Locations::TOTALS_CSV)

  create_hash(operation, centre, date, time, upload_type, array)
end


And(/^the following out of commission references and reasons are submitted$/) do |table|
  assign_ooc_reason(table)
end


Given(/^(.*) has submitted the following information regarding their (.*) beds$/) do |centre, operation, table|
  date=get_date
  time =get_time
  create_hash(operation, centre, date, time, table)
end

def get_date
  Date.today
end

def get_time
  Time.now.utc.strftime("%H:%M:%S")
end

def assign_ooc_reason(table)
  @table_hash ||= Hash.new
  @default_post = DC_data::Posts::DC_default

  table= table.hashes
  table.each do |hash|

    @table_hash=hash.symbolize_keys

    @ooc_reason_hash= Hash.new
    @ooc_reason_hash[:ref]=@table_hash[:reference]
    @ooc_reason_hash[:reason]= @table_hash[:reason]

    ooc_details_index=@table_hash[:ref].to_i-1
    @default_post[:bed_counts][:out_of_commission][:details][ooc_details_index]=@ooc_reason_hash

  end

end