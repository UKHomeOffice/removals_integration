module DC_data

  class Import
    def initialize(type, centre, date, time, import_data)
      @case_hash ||= Hash.new
      @default_post = DC_data::Posts::DC_default


      @default_post[:date]=date
      @default_post[:time]=time
      @default_post[:centre]=centre
      @default_post[:operation]=type


      if import_data.class != Array
        import_data= import_data.hashes
      end

      import_data.each do |hash|

        @case_hash=hash.symbolize_keys

        @default_post[:bed_counts][:male]=@case_hash[:male]
        @default_post[:bed_counts][:female]=@case_hash[:female]
        @default_post[:bed_counts][:out_of_commission][:ooc_male]=@case_hash[:ooc_male]
        @default_post[:bed_counts][:out_of_commission][:ooc_female]=@case_hash[:ooc_female]

        if @case_hash[:ooc_male].to_i > 1
          x=1
          while x <= @case_hash[:ooc_male].to_i
            ooc = Hash.new
            ooc[:ref] = "#{x}"
            ooc[:reason] = 'reason' + "#{x}"
            @default_post[:bed_counts][:out_of_commission][:details].push(ooc)
            x=x+1
          end
        end

        if @case_hash[:ooc_female].to_i > 1
          x=1
          while x <= @case_hash[:ooc_female].to_i
            ooc = Hash.new
            ooc[:ref] = "#{x}"
            ooc[:reason] = 'reason' + "#{x}"
            @default_post[:bed_counts][:out_of_commission][:details].push(ooc)
            x=x+1
          end
        end


        def get_info
          @default_post
        end

      end

    end
  end
end


