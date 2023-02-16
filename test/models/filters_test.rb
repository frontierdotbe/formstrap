require "test_helper"

class FiltersTest < ActiveSupport::TestCase
  describe "Query with multiple filters" do
    before do
      @collection = Post.all

      @params = {
        created_at: "gt:2021-08-11",
        comment_count: "gt:10"
      }

      @filters = Headmin::Filters.new(@params, {created_at: :date, comment_count: :number})
    end

    it "returns the correct query" do
      assert_equal @collection.where("created_at > ?", "2021-08-11").where("comment_count > 10").to_a, @filters.query(@collection)
    end
  end

  describe "Query with multiple filters and with unknown param_types" do
    before do
      @collection = Post.all

      @params = {
        title: "matches:st",
        created_at: "gt:2021-08-11",
        comment_count: "gt:10"
      }

      @filters = Headmin::Filters.new(@params, {created_at: :date, comment_count: :number})
    end

    it "returns the correct query" do
      assert_equal @collection.where("created_at > ?", "2021-08-11").where("comment_count > 10").where("title LIKE ?", "%st%").to_a, @filters.query(@collection)
    end
  end
end
