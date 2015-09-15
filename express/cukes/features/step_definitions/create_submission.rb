def create_hash(upload_type, import_data, operation=nil, centre=nil, date=get_date, time=get_time)
  DC_data::Import.new(upload_type, import_data, operation, centre, date, time)
end

def create_json
  json= DC_data::Posts::DC_default.to_json
  response = dashboard_api.post(DC_data::Endpoints::UPDATE_CENTRES, json, {'Content-Type' => 'application/json'}).body
  puts response
end

def get_date
  Date.today
end

def get_time
  Time.now.utc.strftime("%H:%M:%S")
end

def assign_ooc_reason(import_data)
  @import_data_hash ||= Hash.new
  @default_post = DC_data::Posts::DC_default

  import_data= import_data.hashes
  import_data.each do |hash|

    @import_data_hash=hash.symbolize_keys

    @ooc_reason_hash= Hash.new
    @ooc_reason_hash[:ref]=@import_data_hash[:reference]
    @ooc_reason_hash[:reason]= @import_data_hash[:reason]

    ooc_details_index=@import_data_hash[:ref].to_i-1
    @default_post[:bed_counts][:out_of_commission][:details][ooc_details_index]=@ooc_reason_hash

  end
end