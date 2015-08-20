module DC_data

  class Import
    def initialize(data, type, location, date, time, import_data)
      @case_hash ||= Hash.new
      @default_post = DC_data::Posts::DC_default


      if import_data.class != Array
        import_data= import_data.hashes
      end

      import_data.each do |hash|

        @case_hash=hash.symbolize_keys


        case type
          when 'totals'
            @default_post[:totals][:date]=date
            @default_post[:totals][:time]=time
            if data != 'csv'
              @default_post[:totals][:bed_counts][:"#{location}"]=@case_hash.extract!(:male, :female, :out_of_commission)
            else
              @default_post[:totals][:bed_counts][:"#{@case_hash[:irc_name]}"] = @case_hash.extract!(:male, :female, :out_of_commission)
            end

          when 'arrivals'
            arrival = Hash.new
            arrival[:date]=date
            arrival[:time]=time
            arrival.merge!(@case_hash)
            @default_post[:individuals][:arrivals].push(arrival)

          when 'departees'
            depart = Hash.new
            depart[:date]=date
            depart[:time]=time
            depart.merge!(@case_hash)
            @default_post[:individuals][:departees].push(depart)

        end
      end
    end

    def get_info
      @default_post
    end

  end
end


