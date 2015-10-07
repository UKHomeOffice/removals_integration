def confirm_submission_data(options={})

  @import_data = options[:import_data]
  @centre = options[:centre]
  @gender = options[:gender]
  @total = options[:total]
  @type= options[:type]

 if @centre == nil

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
