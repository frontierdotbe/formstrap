require "test_helper"

class DateFilterTest < ActiveSupport::TestCase
  describe "Filter with date as type" do
    before do
      @params = {created_at: "2021-08-11"}

      filters = Headmin::Filters.new(@params, {created_at: :date})
      @filter = filters.parse(:created_at, :date)

      @collection = Post.all
    end

    it "returns the raw value when asked raw_value" do
      assert_equal @params[:created_at], @filter.raw_value
    end

    it "returns the transformed value when asked value" do
      assert_equal [@params[:created_at].to_date], @filter.values
    end

    it "returns the operator value eq when asked operator" do
      assert_equal ["eq"], @filter.operators
    end

    it "returns the query when asked for query" do
      assert_equal @collection.where("created_at = ?", "2021-08-11").length, @filter.query(@collection).length
    end

    it "raises a TypeError if the value provide is not a valid date" do
      @params = {created_at: "invalid"}

      filters = Headmin::Filters.new(@params, {created_at: :date})

      assert_raises(TypeError) { @filter = filters.parse(:created_at, :date) }
    end
  end
end
