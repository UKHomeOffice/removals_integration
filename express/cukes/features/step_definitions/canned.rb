def create_hash(type, centre, date, time, import_data)
  @data=DC_data::Import.new(type, centre, date, time, import_data)
end

def create_json
  json= DC_data::Posts::DC_default.to_json
  response = dashboard_api.post(DC_data::Endpoints::UPDATE_CENTRES, json, {'Content-Type' => 'application/json'}).body
  puts response
end

def symbolize_data(data)
  data.to_sym

end