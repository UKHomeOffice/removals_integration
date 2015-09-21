def create_submission(import_data, options={})
  @new_post=DC_data::Import.new(import_data, options)
end

def post_data_to_api
  @new_post.create_json
end

def create_ooc_reasons(import_data, options={})
  @new_post=DC_data::Import.new(import_data, options)
  @new_post.assign_ooc_reason(import_data)
end