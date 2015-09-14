module DC_data
  module Posts
    DC_default ||= {
        :date => '',
        :time => '',
        :centre => '',
        :operation => '',
        :cid_id => '',
        :gender => '',
        :nationality => '',

        :bed_counts => {
            :male => '',
            :female => '',

            :out_of_commission => {
                :ooc_male => '',
                :ooc_female => '',

                :details => [
                ]
            }
        }

    }
  end
end

