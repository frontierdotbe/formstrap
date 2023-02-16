require "test_helper"

class HeadminTest < Minitest::Test
  def test_that_it_has_a_version_number
    refute_nil ::Headmin::VERSION
  end
end
