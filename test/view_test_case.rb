require "test_helper"
require "dummy/app/controllers/application_controller"

class ViewTestCase < ActiveSupport::TestCase
  include Capybara::DSL
  include Capybara::Minitest::Assertions

  Capybara::Session.new(:rack_test)

  def visit_inline(text = nil, locals: {})
    html = block_given? ? yield : text
    Capybara.app = proc do |env|
      [
        200,
        {"Content-Type" => "text/html"},
        [renderer.render(inline: html, locals: locals)]
      ]
    end
    visit("/")
  end

  private

  def renderer
    ApplicationController.renderer.new(
      http_host: "headmin.test",
      https: true
    )
  end
end
