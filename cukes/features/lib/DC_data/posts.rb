module DC_data
  module Posts

    Post_default = {
        :date => '2015-01-01',
        :time => '08:00:00',
        :centre => 'harmondsworth',
        :operation => 'in',
        :cid_id => 01234,
        :gender => 'm',
        :nationality => 'afg',

        :bed_counts => {
            :male => 1,
            :female => 0,

            :out_of_commission => {
                :ooc_male => 0,
                :ooc_female => 0,

                :details => [
                ]
            }
        }

    }

    Inter_transfer = {
        :date => '2015-01-01',
        :time => '08:00:00',
        :centre => 'harmondsworth',
        :operation => 'tra',
        :cid_id => 01234,
        :gender => 'm',
        :nationality => 'afg',
        :centre_to => 'colnbrook',


        :bed_counts => {
            :male => 1,
            :female => 0,

            :out_of_commission => {
                :ooc_male => 0,
                :ooc_female => 0,

                :details => [
                ]
            }
        }

    }
  end
end

