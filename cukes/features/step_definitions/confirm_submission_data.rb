def confirm_submission_data(options={})

  @import_data = options[:import_data]
  @centre = options[:centre]
  @gender = options[:gender]
  @total = options[:total]
  @availability = options[:availability]

  if @import_data != nil

    @import_data_hash ||= Hash.new

    if @import_data.class != Array
      @import_data= @import_data.hashes
    end

    @import_data.each do |hash|

      @import_data_hash=hash.symbolize_keys

      expect(page.find(:css, '#' + "#{@import_data_hash[:centre]}" + '.panel ul.availability li.available span.male b.num').text).to eq "#{@import_data_hash[:male]}"
      expect(page.find(:css, '#' + "#{@import_data_hash[:centre]}" + '.panel ul.availability li.available span.female b.num').text).to eq "#{@import_data_hash[:female]}"
      expect(page.find(:css, '#' + "#{@import_data_hash[:centre]}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{@import_data_hash[:ooc_male]}"
      expect(page.find(:css, '#' + "#{@import_data_hash[:centre]}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{@import_data_hash[:ooc_female]}"
    end

  elsif @centre == nil

    @centre_num =
        if "#{DC_data::Post_data.get_post_centre}" == 'harmondsworth'
          @centre_num = 3
        end

    expect(page.find(:xpath, '/html/body/table/tbody/tr['+"#{@centre_num}" +']/td[8]').text).to include "#{DC_data::Post_data.get_post_ooc_male}"
    expect(page.find(:xpath, '/html/body/table/tbody/tr['+"#{@centre_num}" +']/td[9]').text).to include "#{DC_data::Post_data.get_post_ooc_female}"

  else

    expect(page.find(:xpath, '/html/body/table/tbody/tr['+"#{@centre_num}" +']/td[9]').text).to include "#{DC_data::Post_data.get_post_ooc_female}"

  end
end
