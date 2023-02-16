require "test_helper"

class FieldFilterTest < ActiveSupport::TestCase
  describe "Filter with association attributes" do
    before do
      string = "eq:Welcome to our blog"
      param_types = {
        title: :field
      }

      @params = {field_title: string}
      filters = Headmin::Filters.new(@params, param_types)
      @filter = filters.parse(:title, :field)
      @collection = Block.all
    end

    it "should have Filter type Field" do
      assert_equal @filter.class, Headmin::Filter::Field
    end

    it "should have the correct operator for the first instruction" do
      assert_equal @filter.instructions.first[:operator], "eq"
    end

    it "should have the correct value for the first instruction" do
      assert_equal @filter.instructions.first[:value], "Welcome to our blog"
    end

    it "returns the right blocks based on the attribute of field" do
      assert_equal Block.joins(:fields).where(Field.arel_table[:name].matches(:title)), @filter.query(@collection).to_a
    end
  end
end
