require_relative 'posts'

module DC_data

  module Post_data

    @default_post = DC_data::Posts::Post_default

    def Post_data.get_post_date
      @default_post[:date]
    end

    def Post_data.get_post_time
      @default_post[:time]
    end

    def Post_data.get_post_centre
      @default_post[:centre]
    end

    def Post_data.get_post_operation
      @default_post[:operation]
    end

    def Post_data.get_post_cid_id
      @default_post[:cid_id]
    end

    def Post_data.get_post_gender
      @default_post[:gender]
    end

    def Post_data.get_post_nationality
      @default_post[:nationality]
    end

    def Post_data.get_post_male
      @default_post[:bed_counts][:male]
    end

    def Post_data.get_post_female
      @default_post[:bed_counts][:female]
    end

    def Post_data.get_post_ooc_male
      @default_post[:bed_counts][:out_of_commission][:ooc_male]
    end

    def Post_data.get_post_ooc_female
      @default_post[:bed_counts][:out_of_commission][:ooc_female]
    end

    def Post_data.get_post_ooc_details
      @default_post[:bed_counts][:out_of_commission][:details]
    end

  end

end