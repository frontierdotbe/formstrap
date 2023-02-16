require "test_helper"

class ViewModelTest < Minitest::Test
  describe "#to_hash" do
    describe "with pristine attributes" do
      it "returns the input hash" do
        @hash = {name: "John Doe", age: 70}
        @model = ViewModel.new(@hash)
        assert_equal @hash, @model.to_hash
      end
    end

    describe "when hash contains reserved method names" do
      it "returns the input hash" do
        @hash = {class: "d-none"}
        @model = ViewModel.new(@hash)
        assert_equal @hash, @model.to_hash
      end
    end
  end

  describe "#to_h" do
    it "aliases #to_hash" do
      ViewModel.new.method(:to_hash) == ViewModel.new.method(:to_h)
    end
  end

  describe "attribute" do
    describe "when attribute exists" do
      it "returns the original hash value" do
        @model = ViewModel.new(name: "John Doe", age: 70)
        assert_equal "John Doe", @model.name
        assert_equal 70, @model.age
      end
    end

    describe "when attribute doesn't exists" do
      it "returns nil" do
        @model = ViewModel.new(name: "John Doe", age: 70)
        assert_nil @model.non_existent
      end
    end

    describe "when attribute is reserved method" do
      it "returns reserved method response" do
        @model = ViewModel.new(class: "d-none")
        assert_equal ViewModel, @model.class
      end
    end
  end
end
