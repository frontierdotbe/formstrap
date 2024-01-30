class ApplicationHelper
  def show_svg(attachment, options = {})
    return if !attachment.content_type.include?('svg')

    attachment.open do |file|
      content = file.read
      doc = Nokogiri::HTML::DocumentFragment.parse content
      svg = doc.at_css 'svg'

      # for security
      doc.search('script').each do |src|
        src.remove
      end

      options.each { |attr, value| svg[attr.to_s] = value }

      doc.to_html.html_safe
    end
  end
end