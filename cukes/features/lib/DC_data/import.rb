module DC_data

  class Import
    extend DC_data::Post_data

    def initialize(import_data, options)
      @import_data = import_data
      @upload_type = options[:upload_type]
      @operation = options[:operation]
      @centre = options[:centre]
      @centre_to = options[:centre_to]
      @date = options[:date]
      @time = options[:time]
    end

    def create_post

      @import_data_hash ||= Hash.new


      if @import_data.class != Array
        @import_data= @import_data.hashes
      end

      @import_data.each do |hash|

        @import_data_hash=hash.symbolize_keys


        Post_data.define_default_post(@operation.nil? ? @import_data_hash[:operation] : @operation)


        Post_data.get_post[:centre]= @centre.nil? ? @import_data_hash[:centre] : @centre
        Post_data.get_post[:operation]= @operation.nil? ? @import_data_hash[:operation] : @operation
        Post_data.get_post[:bed_counts][:male]=@import_data_hash[:male].to_i
        Post_data.get_post[:bed_counts][:female]=@import_data_hash[:female].to_i
        Post_data.get_post[:bed_counts][:out_of_commission][:ooc_male]=@import_data_hash[:ooc_male].to_i
        Post_data.get_post[:bed_counts][:out_of_commission][:ooc_female]=@import_data_hash[:ooc_female].to_i

        Post_data.get_post[:bed_counts][:out_of_commission][:details].clear

        y=1
        if @import_data_hash[:ooc_male].to_i > 1
          x=1
          while x <= @import_data_hash[:ooc_male].to_i
            ooc = Hash.new
            ooc[:ref] = "#{y}"
            ooc[:reason] = 'reason' + "#{y}"
            ooc[:gender] = 'm'
            Post_data.get_post[:bed_counts][:out_of_commission][:details].push(ooc)
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
            Post_data.get_post[:bed_counts][:out_of_commission][:details].push(ooc)
            x=x+1
            y=y+1
          end
        end


        if @upload_type == 'csv'
          Post_data.get_post[:cid_id]=@import_data_hash[:cid_id].to_i
          Post_data.get_post[:gender]=@import_data_hash[:gender]
          Post_data.get_post[:nationality]=@import_data_hash[:nationality]
          Post_data.get_post[:date]=@import_data_hash[:date]
          Post_data.get_post[:time]=@import_data_hash[:time]
          if @import_data_hash[:operation] == 'tra'
            Post_data.get_post[:centre_to]=@import_data_hash[:centre_to]
          end

          create_json

        else

          Post_data.get_post[:date]= @date.nil? ? Date.today : @date
          Post_data.get_post[:time]= @time.nil? ? Time.now.utc.strftime("%H:%M:%S") : @time

          if @operation != 'bic' && @operation != 'ooc'
            Post_data.get_post[:cid_id]=@import_data_hash[:cid_id].nil? ? Post_data.get_post[:cid_id] : @import_data_hash[:cid_id].to_i
            Post_data.get_post[:gender]=@import_data_hash[:gender].nil? ? Post_data.get_post[:gender] : @import_data_hash[:gender]
            Post_data.get_post[:nationality]=@import_data_hash[:nationality].nil? ? Post_data.get_post[:nationality] : @import_data_hash[:nationality]
          else
            Post_data.get_post[:cid_id]=0
            Post_data.get_post[:gender]='na'
            Post_data.get_post[:nationality]='na'
          end

          if @operation == 'tra'
            Post_data.get_post[:centre_to]=@centre_to
          end
        end
      end
    end

    def create_json
      json= Post_data.get_post.to_json
      response = dashboard_api.post(DC_data::Config::Endpoints::UPDATE_CENTRES, json, {'Content-Type' => 'application/json'}).body
      puts response
      response.include?('ooc_male_beds')
    end

    def assign_ooc_reason
      @import_data= @import_data.hashes

      @import_data.each do |hash|

        @import_data_hash=hash.symbolize_keys

        @ooc_reason_hash= Hash.new
        @ooc_reason_hash[:ref]=@import_data_hash[:reference]
        @ooc_reason_hash[:reason]= @import_data_hash[:reason]
        @ooc_reason_hash[:gender]= @import_data_hash[:gender]
        ooc_details_index=@import_data_hash[:ref].to_i-1
        Post_data.get_post[:bed_counts][:out_of_commission][:details][ooc_details_index]=@ooc_reason_hash
      end
    end
  end
end



