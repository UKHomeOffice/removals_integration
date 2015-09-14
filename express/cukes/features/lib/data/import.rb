module DC_data

  class Import
    def initialize(operation, centre, date, time, upload_type, import_data)
      @case_hash ||= Hash.new
      @default_post = DC_data::Posts::DC_default


      if import_data.class != Array
        import_data= import_data.hashes
      end

      import_data.each do |hash|

        @case_hash=hash.symbolize_keys

        @default_post[:date]=date||=@case_hash[:date]
        @default_post[:time]=time||=@case_hash[:time]
        @default_post[:centre]=centre||=@case_hash[:centre]
        @default_post[:operation]=operation||=@case_hash[:operation]
        @default_post[:bed_counts][:male]=@case_hash[:male]
        @default_post[:bed_counts][:female]=@case_hash[:female]
        @default_post[:bed_counts][:out_of_commission][:ooc_male]=@case_hash[:ooc_male]
        @default_post[:bed_counts][:out_of_commission][:ooc_female]=@case_hash[:ooc_female]

        y=1
        if @case_hash[:ooc_male].to_i > 1
          x=1
          while x <= @case_hash[:ooc_male].to_i
            ooc = Hash.new
            ooc[:ref] = "#{y}"
            ooc[:reason] = 'reason' + "#{y}"
            @default_post[:bed_counts][:out_of_commission][:details].push(ooc)
            x=x+1
            y=y+1
          end
        end

        if @case_hash[:ooc_female].to_i > 1
          x=1
          while x <= @case_hash[:ooc_female].to_i
            ooc = Hash.new
            ooc[:ref] = "#{y}"
            ooc[:reason] = 'reason' + "#{y}"
            @default_post[:bed_counts][:out_of_commission][:details].push(ooc)
            x=x+1
            y=y+1
          end
        end


        if upload_type == 'csv'
          @default_post[:cid_id]=@case_hash[:cid_id]
          @default_post[:gender]=@case_hash[:gender]
          @default_post[:nationality]=@case_hash[:nationality]
          create_json
        else
          if operation.eql?('in') || operation.eql?('out')
            @default_post[:cid_id]='123456'
            @default_post[:gender]='m'
            @default_post[:nationality]='ABD'
          end
        end

      end

      def get_info
        @default_post
      end

    end

  end
end


