def import_initial_data(import_data, options={})
  @new_post=DC_data::Import.new(import_data, options)
end

def create_submission
  @new_post.create_post
end

def post_data_to_api
  @new_post.create_json
end

def create_ooc_reasons
  @new_post.assign_ooc_reason
end

