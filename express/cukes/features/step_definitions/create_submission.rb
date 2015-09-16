def create_submission(import_data, upload_type=nil, operation=nil, centre=nil, date=nil, time=nil)
  @new_post=DC_data::Import.new(import_data, upload_type, operation, centre, date, time)
  @new_post.create_post
end

def create_ooc_reasons(import_data)
  @new_post.assign_ooc_reason(import_data)
end
