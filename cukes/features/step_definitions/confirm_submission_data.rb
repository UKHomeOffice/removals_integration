def confirm_submission_data(options={})
  @confirm_post=DC_data::Confirm_totals.new(options)
  @confirm_post.check_data
end