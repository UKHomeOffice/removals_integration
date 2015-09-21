module DC_data

  module Post_data

    def Post_data.get_post_date
      DC_data::Posts::Post_default[:date]
    end

    def Post_data.get_post_time
      DC_data::Posts::Post_default[:time]
    end

    def Post_data.get_post_centre
      DC_data::Posts::Post_default[:centre]
    end

    def Post_data.get_post_operation
      DC_data::Posts::Post_default[:operation]
    end

    def Post_data.get_post_cid_id
      DC_data::Posts::Post_default[:cid_id]
    end

    def Post_data.get_post_gender
      DC_data::Posts::Post_default[:gender]
    end

    def Post_data.get_post_nationality
      DC_data::Posts::Post_default[:nationality]
    end

    def Post_data.get_post_male
      DC_data::Posts::Post_default[:bed_counts][:male]
    end

    def Post_data.get_post_female
      DC_data::Posts::Post_default[:bed_counts][:female]
    end

    def Post_data.get_post_ooc_male
      DC_data::Posts::Post_default[:bed_counts][:out_of_commission][:ooc_male]
    end

    def Post_data.get_post_ooc_female
      DC_data::Posts::Post_default[:bed_counts][:out_of_commission][:ooc_female]
    end

    def Post_data.get_post_ooc_details
      DC_data::Posts::Post_default[:bed_counts][:out_of_commission][:details]
    end

  end

end