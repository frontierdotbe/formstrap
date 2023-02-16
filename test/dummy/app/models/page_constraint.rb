class PageConstraint
  def matches?(request)
    request.path.exclude?("rails/active_storage") && request.path.exclude?("headmin/media")
  end
end
