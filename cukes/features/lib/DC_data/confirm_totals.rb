require "#{File.dirname(__FILE__)}/post_data.rb"

module DC_data
  class Confirm_totals
    extend DC_data::Post_data

    def initialize(options)

      @centre = options[:centre]
      @gender = options[:gender]
      @total = options[:total]
      @availability = options[:availability]
      @import_data = options[:import_data]
    end


    def check_data

      if @import_data != nil

        @import_data_hash ||= Hash.new

        if @import_data.class != Array
          @import_data= @import_data.hashes
        end

        @import_data.each do |hash|

          @import_data_hash=hash.symbolize_keys

          expect(page.find(:css, '#' + "#{@import_data_hash[:centre].downcase}" + '.panel ul.availability li.available span.male b.num').text).to eq "#{@import_data_hash[:male]}"
          expect(page.find(:css, '#' + "#{@import_data_hash[:centre].downcase}" + '.panel ul.availability li.available span.female b.num').text).to eq "#{@import_data_hash[:female]}"
          expect(page.find(:css, '#' + "#{@import_data_hash[:centre].downcase}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{@import_data_hash[:ooc_male]}"
          expect(page.find(:css, '#' + "#{@import_data_hash[:centre].downcase}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{@import_data_hash[:ooc_female]}"
        end

      elsif @centre == nil

        expect(page.find(:css, '#' + "#{Post_data.get_post_centre.downcase}"+ '.panel ul.availability li.available span.male b.num').text).to eq "#{Post_data.get_post_male}"
        expect(page.find(:css, '#' + "#{Post_data.get_post_centre.downcase}" + '.panel ul.availability li.available span.female b.num').text).to eq "#{Post_data.get_post_female}"
        expect(page.find(:css, '#' + "#{Post_data.get_post_centre.downcase}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{Post_data.get_post_ooc_male}"
        expect(page.find(:css, '#' + "#{Post_data.get_post_centre.downcase}" + '.panel ul.availability li.unavailable span.ooc b.num').text).to eq "#{Post_data.get_post_ooc_female}"

      else

        expect(page.find(:css, '#' + "#{@centre}" + '.panel ul.availability li.available span.' + "#{@gender}" + ' b.num').text).to eq "#{@total}"

      end
    end
  end
end
