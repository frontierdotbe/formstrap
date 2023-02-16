require "test_helper"

class BooleanFilterTest < ActiveSupport::TestCase
  describe "Filter with boolean as type" do
    before do
      @collection = Post.all

      @string = "0"
      filters = Headmin::Filters.new({published: @string}, {published: :boolean})
      @filter = filters.parse(:published, :boolean)
    end

    it "returns the correct raw value" do
      assert_equal @string, @filter.raw_value
    end

    it "returns the correct values" do
      assert_equal [false], @filter.values
    end

    it "returns the correct operator" do
      assert_equal ["eq"], @filter.operators
    end

    it "returns the correct query" do
      assert_equal @collection.where(published: false).to_a, @filter.query(@collection)
    end

    it "returns the correct query with not_eq" do
      @string = "not_eq:0"
      filters = Headmin::Filters.new({published: @string}, {published: :boolean})
      @filter = filters.parse(:published, :boolean)

      assert_equal @collection.where.not(published: false).to_a, @filter.query(@collection)
    end

    it "does not support gt operator" do
      @string = "gt:1"
      filters = Headmin::Filters.new({published: @string}, {published: :boolean})

      assert_raises(Headmin::Filter::OperatorNotSupportedError) { filters.parse(:published, :boolean) }
    end
  end
end
