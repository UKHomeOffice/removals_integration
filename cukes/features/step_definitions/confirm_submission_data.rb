def confirm_submission_data(options={})

  @import_data = options[:import_data]
  @centre = options[:centre]
  @gender = options[:gender]
  @total = options[:total]
  @type= options[:type]

  # Data via a csv
  if @import_data != nil

    @import_data_hash ||= Hash.new

    if @import_data.class != Array
      @import_data= @import_data.hashes
    end

    @import_data.each do |hash|

      @import_data_hash=hash.symbolize_keys


      expect(page.find(:xpath, '/html/body/table/tbody/tr['+ "#{DC_data::Post_data.get_centre_num("#{@import_data_hash[:centre]}")}" +']/td[8]').text).to include "#{@import_data_hash[:ooc_male]}"
      expect(page.find(:xpath, '/html/body/table/tbody/tr['+ "#{DC_data::Post_data.get_centre_num("#{@import_data_hash[:centre]}")}"+']/td[9]').text).to include "#{@import_data_hash[:ooc_female]}"

    end

    # If no centre name is passed check against the default post
  elsif @centre == nil

    expect(page.find(:xpath, '/html/body/table/tbody/tr['+ "#{DC_data::Post_data.get_centre_num}" +']/td[8]').text).to include "#{DC_data::Post_data.get_post_ooc_male}"
    expect(page.find(:xpath, '/html/body/table/tbody/tr['+ "#{DC_data::Post_data.get_centre_num}" +']/td[9]').text).to include "#{DC_data::Post_data.get_post_ooc_female}"

  else

    if @gender == 'male'
      @num = 8
    else
      @num = 9
    end


    expect(page.find(:xpath, '/html/body/table/tbody/tr['+ "#{DC_data::Post_data.get_centre_num(@centre)}" +']/td['+ "#{@num}" +']').text).to include "#{@total}"

  end
end
