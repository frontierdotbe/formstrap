require "test_helper"

class TextFilterTest < ActiveSupport::TestCase
  describe "Filter with text as type" do
    before do
      @collection = Post.all

      @string = "matches:post"
      filters = Headmin::Filters.new({title: @string}, {title: :title})
      @filter = filters.parse(:title, :text)
    end

    it "returns the correct raw value" do
      assert_equal @string, @filter.raw_value
    end

    it "returns the correct values" do
      assert_equal ["post"], @filter.values
    end

    it "returns the correct operator" do
      assert_equal ["matches"], @filter.operators
    end

    it "returns the correct query with matches as operator" do
      assert_equal @collection.where("title LIKE ?", "%post%").to_a, @filter.query(@collection)
    end

    it "returns the correct query with not_matches as operator" do
      @string = "does_not_match:post"
      filters = Headmin::Filters.new({title: @string}, {title: :title})
      @filter = filters.parse(:title, :text)

      assert_equal @collection.where.not("title LIKE ?", "%post%").to_a, @filter.query(@collection)
    end
  end
end
