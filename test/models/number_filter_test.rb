require "test_helper"

class NumberFilterTest < ActiveSupport::TestCase
  describe "Filter with number as type" do
    before do
      @collection = Post.all

      @string = "gt:10+AND+lt:20"
      filters = Headmin::Filters.new({comment_count: @string}, {comment_count: :number})
      @filter = filters.parse(:comment_count, :number)
    end

    it "returns the correct raw value" do
      assert_equal @string, @filter.raw_value
    end

    it "returns the correct values" do
      assert_equal [10, 20], @filter.values
    end

    it "returns the correct operators" do
      assert_equal ["gt", "lt"], @filter.operators
    end

    it "returns the correct conditional" do
      assert_equal ["and"], @filter.conditionals
    end

    it "returns the correct query" do
      assert_equal @collection.where("comment_count > ?", 10).and(@collection.where("comment_count < ?", 20)).to_a, @filter.query(@collection)
    end

    it "default to 0 if value is not an integer" do
      filters = Headmin::Filters.new({comment_count: "gt:invalid"}, {comment_count: :number})
      filter = filters.parse(:comment_count, :number)
      assert_equal [0], filter.values
    end
  end
end
