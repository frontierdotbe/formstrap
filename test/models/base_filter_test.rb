require "test_helper"

class BaseFilterTest < ActiveSupport::TestCase
  describe "Filter with params containing operators" do
    before do
      @date = "2021-08-11"
      @operator = "gt"
      @params = {created_at: "#{@operator}:#{@date}"}

      filters = Headmin::Filters.new(@params, {created_at: :date})
      @filter = filters.parse(:created_at, :date)

      @collection = Post.all
    end

    it "returns the raw value when asked raw_value" do
      assert_equal @params[:created_at], @filter.raw_value
    end

    it "returns the transformed values when asked values" do
      assert_equal [@date.to_date], @filter.values
    end

    it "returns the operators value when asked operators" do
      assert_equal [@operator], @filter.operators
    end

    it "returns the query when asked for query" do
      assert_equal @collection.where("created_at > ?", @date.to_date).length, @filter.query(@collection).length
    end
  end

  describe "Filter with params containing the between and not between operator" do
    before do
      @dates = "2021-08-05,2021-08-22"
      @operators = "between"
      @params = {created_at: "#{@operators}:#{@dates}"}

      filters = Headmin::Filters.new(@params, {created_at: :date})
      @filter = filters.parse(:created_at, :date)

      @collection = Post.all
    end

    it "returns the transformed values when askeds" do
      assert_equal ["2021-08-05".to_date.."2021-08-22".to_date], @filter.values
    end

    it "returns the query when asked for the query using operator between" do
      assert_equal @collection.where(created_at: "2021-08-05".to_date.."2021-08-22".to_date).to_a, @filter.query(@collection)
    end

    it "returns the query when asked for the query using operator not_between" do
      @operators = "not_between"
      @params = {created_at: "#{@operators}:#{@dates}"}

      filters = Headmin::Filters.new(@params, {created_at: :date})
      @filter = filters.parse(:created_at, :date)

      assert_equal @collection.where.not(created_at: "2021-08-05".to_date.."2021-08-22".to_date).to_a, @filter.query(@collection)
    end
  end

  describe "Filter with params containing the in and not in operator" do
    before do
      @dates = "2021-08-10,2021-08-11,2021-08-12,2021-08-13"
      @operators = "in"
      @params = {created_at: "#{@operators}:#{@dates}"}

      filters = Headmin::Filters.new(@params, {created_at: :date})
      @filter = filters.parse(:created_at, :date)

      @collection = Post.all
    end

    it "returns the transformed values when asked" do
      assert_equal [@dates.split(",").map { |date| date.to_date }], @filter.values
    end

    it "returns the query when asked for the query using operator in" do
      assert_equal @collection.where(created_at: ["2021-08-10".to_date, "2021-08-11".to_date, "2021-08-12".to_date, "2021-08-13".to_date]).to_a, @filter.query(@collection)
    end

    it "returns the query when asked for the query using operator in" do
      @operators = "not_in"
      @params = {created_at: "#{@operators}:#{@dates}"}

      filters = Headmin::Filters.new(@params, {created_at: :date})
      @filter = filters.parse(:created_at, :date)

      @collection = Post.all

      assert_equal @collection.where.not(created_at: ["2021-08-10".to_date, "2021-08-11".to_date, "2021-08-12".to_date, "2021-08-13".to_date]).to_a, @filter.query(@collection)
    end
  end

  describe "Filter with params containing the is_nul and is_not_null operator" do
    before do
      @string = "is_not_null:1"
      filters = Headmin::Filters.new({comment_count: @string}, {comment_count: :number})
      @filter = filters.parse(:comment_count, :number)

      @collection = Post.all
    end

    it "returns the query when asked for the query using operator is_not_null" do
      assert_equal @collection.where.not(comment_count: nil).to_a, @filter.query(@collection)
    end
  end

  describe "Filter with params containing multiple operators and conditional" do
    before do
      @dates = ["2021-08-10", "2020-08-13"]
      @operators = ["gteq", "lteq"]
      @conditional = "OR"
      @params = {created_at: "#{@operators[0]}:#{@dates[0]}+#{@conditional}+#{@operators[1]}:#{@dates[1]}"}

      filters = Headmin::Filters.new(@params, {created_at: :date})
      @filter = filters.parse(:created_at, :date)

      @collection = Post.all
    end

    it "returns the raw value when asked raw_value" do
      assert_equal @params[:created_at], @filter.raw_value
    end

    it "returns the transformed values when asked values" do
      assert_equal @dates.map { |date| date.to_date }, @filter.values
    end

    it "returns the conditionals" do
      assert_equal [@conditional.downcase], @filter.conditionals
    end

    it "returns the operators" do
      assert_equal @operators, @filter.operators
    end

    it "returns the query when asked for the query" do
      assert_equal @collection.where("created_at >= ?", @dates[0].to_date).or(@collection.where("created_at <= ?", @dates[1].to_date)).length, @filter.query(@collection).length
    end
  end

  describe "Filter with params containing multiple operators and multiple conditionals" do
    before do
      string = "gt:2021-08-10+AND+lt:2021-08-21+OR+gt:2021-08-25"

      @params = {created_at: string}
      filters = Headmin::Filters.new(@params, {created_at: :date})
      @filter = filters.parse(:created_at, :date)
      @collection = Post.all
    end

    it "returns the conditionals when asked for conditionals" do
      assert_equal %w[and or], @filter.conditionals
    end

    it "returns the correct query when asked for query" do
      assert_equal @collection.where("created_at > ?", "2021-08-10".to_date).and(@collection.where("created_at < ?", "2021-08-21".to_date)).or(@collection.where("created_at > ?", "2021-08-25".to_date)).to_a, @filter.query(@collection).to_a
    end
  end

  describe "Filter with association attributes" do
    before do
      string = "eq:title"
      param_types = {
        fields: {
          name: :text
        }
      }

      @params = {fields_name: string}
      filters = Headmin::Filters.new(@params, param_types)
      @filter = filters.parse(:name, :text, association: :fields)
      @collection = Block.all
    end

    it "returns the right blocks based on the attribute of field" do
      assert_equal Block.joins(:fields).where(fields: {name: "title"}), @filter.query(@collection).to_a
    end
  end

  describe "Filter with an unknown association" do
    before do
      string = "eq:title"
      param_types = {
        test: {
          name: :text
        }
      }

      @params = {test_name: string}
      filters = Headmin::Filters.new(@params, param_types)
      @filter = filters.parse(:name, :text, association: :test)
      @collection = Block.all
    end

    it "returns a well defined error: UnknownAssociation" do
      assert_raises(Headmin::Filter::UnknownAssociation) { @filter = @filter.query(@collection) }
    end
  end
end
