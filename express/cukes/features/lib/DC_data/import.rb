module DC_data

  class Import
    def initialize(import_data, options)

      @import_data = import_data
      @upload_type = options[:upload_type]
      @operation = options[:operation]
      @centre = options[:centre]
      @date = options[:date]
      @time = options[:time]
    end

    def create_post
      @import_data_hash ||= Hash.new
      @default_post = DC_data::Posts::Post_default

      if @import_data.class != Array
        @import_data= @import_data.hashes
      end

      @import_data.each do |hash|

        @import_data_hash=hash.symbolize_keys

        @default_post[:centre]=@centre||=@import_data_hash[:centre]
        @default_post[:operation]=@operation||=@import_data_hash[:operation]
        @default_post[:bed_counts][:male]=@import_data_hash[:male]
        @default_post[:bed_counts][:female]=@import_data_hash[:female]
        @default_post[:bed_counts][:out_of_commission][:ooc_male]=@import_data_hash[:ooc_male]
        @default_post[:bed_counts][:out_of_commission][:ooc_female]=@import_data_hash[:ooc_female]

        y=1
        if @import_data_hash[:ooc_male].to_i > 1
          x=1
          while x <= @import_data_hash[:ooc_male].to_i
            ooc = Hash.new
            ooc[:ref] = "#{y}"
            ooc[:reason] = 'reason' + "#{y}"
            ooc[:gender] = 'm'
            @default_post[:bed_counts][:out_of_commission][:details].push(ooc)
            x=x+1
            y=y+1
          end
        end

        if @import_data_hash[:ooc_female].to_i > 1
          x=1
          while x <= @import_data_hash[:ooc_female].to_i
            ooc = Hash.new
            ooc[:ref] = "#{y}"
            ooc[:reason] = 'reason' + "#{y}"
            ooc[:gender] = 'f'
            @default_post[:bed_counts][:out_of_commission][:details].push(ooc)
            x=x+1
            y=y+1
          end
        end


        if @upload_type == 'csv'
          @default_post[:cid_id]=@import_data_hash[:cid_id]
          @default_post[:gender]=@import_data_hash[:gender]
          @default_post[:nationality]=@import_data_hash[:nationality]
          @default_post[:date]=@import_data_hash[:date]
          @default_post[:time]=@import_data_hash[:time]
          create_json
        else
          @default_post[:date]=@date||= Date.today
          @default_post[:time]=@time||= Time.now.utc.strftime("%H:%M:%S")

          if @operation.eql?('in') || @operation.eql?('out')
            @default_post[:cid_id]='123456'
            @default_post[:gender]='m'
            @default_post[:nationality]='ABD'
          end
        end
      end
    end

    def create_json
      json= @default_post.to_json
      response = dashboard_api.post(DC_data::Config::Endpoints::UPDATE_CENTRES, json, {'Content-Type' => 'application/json'}).body
      puts response
    end

    def assign_ooc_reason(import_data)
      @import_data_hash ||= Hash.new
      @default_post = DC_data::Posts::Post_default

      import_data= import_data.hashes
      import_data.each do |hash|

        @import_data_hash=hash.symbolize_keys

        @ooc_reason_hash= Hash.new
        @ooc_reason_hash[:ref]=@import_data_hash[:reference]
        @ooc_reason_hash[:reason]= @import_data_hash[:reason]
        @ooc_reason_hash[:gender]= @import_data_hash[:gender]
        ooc_details_index=@import_data_hash[:ref].to_i-1
        @default_post[:bed_counts][:out_of_commission][:details][ooc_details_index]=@ooc_reason_hash
      end
    end
  end
end


