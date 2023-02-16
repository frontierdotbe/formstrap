require "test_helper"

class BlockTest < ActiveSupport::TestCase
  before do
    @block = Block.new
  end

  describe "validations" do
    test "valid block is valid" do
      assert @block.valid?
    end
  end

  describe "fields_hash" do
    describe "by default" do
      it "should return an empty hash" do
        assert_empty @block.fields_hash
      end

      it "should not have fields" do
        assert_empty @block.fields
      end
    end

    describe "storage behaviour" do
      before do
        @hash = {
          title: "Title"
        }
        @block.fields_hash = @hash
      end

      describe "before saving" do
        it "should return the original hash" do
          assert_equal @hash, @block.fields_hash
        end

        it "should not build fields yet" do
          assert_empty @block.fields
        end
      end

      describe "after saving" do
        before do
          @block.save

          # Reset fields
          @block.fields_hash = nil
          @block.fields.reload
        end

        it "should return the original hash" do
          assert_equal @hash, @block.fields_hash
        end

        it "should build fields" do
          assert_equal 1, @block.fields.count
          assert_equal "title", @block.fields[0].name
          assert_equal "Title", @block.fields[0].value
          assert_equal "text", @block.fields[0].field_type
        end

        describe "overwriting fields_hash" do
          before do
            @new_hash = {
              title: "New title"
            }
            @block.fields_hash = @new_hash
            @block.save

            # Reset fields
            @block.fields_hash = nil
            @block.fields.reload
          end

          it "should return the new hash" do
            assert_equal @new_hash, @block.fields_hash
          end

          it "should overwrite existing fields" do
            assert_equal 1, @block.fields.count
            assert_equal "title", @block.fields[0].name
            assert_equal "New title", @block.fields[0].value
            assert_equal "text", @block.fields[0].field_type
          end
        end
      end
    end

    describe "set text hash" do
      before do
        @hash = {
          title: "Title"
        }
        @block.fields_hash = @hash
        @block.save

        # Reset fields
        @block.fields_hash = nil
        @block.fields.reload
      end

      it "should return the original hash" do
        assert_equal @hash, @block.fields_hash
      end

      it "should build fields" do
        assert_equal 1, @block.fields.count
        assert_equal "title", @block.fields[0].name
        assert_equal "Title", @block.fields[0].value
        assert_equal "text", @block.fields[0].field_type
      end
    end

    describe "set group hash" do
      before do
        @hash = {
          button: {
            text: "Click here",
            url: "https://example.com"
          }
        }
        @block.fields_hash = @hash
        @block.save

        # Reset fields
        @block.fields_hash = nil
        @block.fields.reload
      end

      it "should return the original hash" do
        assert_equal @hash, @block.fields_hash
      end

      it "should build fields" do
        assert_equal 3, @block.fields.count

        assert_equal "button", @block.fields[0].name
        assert_nil @block.fields[0].value
        assert_equal "group", @block.fields[0].field_type

        assert_equal "text", @block.fields[1].name
        assert_equal "Click here", @block.fields[1].value
        assert_equal "text", @block.fields[1].field_type

        assert_equal "url", @block.fields[2].name
        assert_equal "https://example.com", @block.fields[2].value
        assert_equal "text", @block.fields[2].field_type
      end
    end

    describe "set list hash" do
      describe "simple list" do
        before do
          @hash = {
            colors: %w[Red Green Blue]
          }
          @block.fields_hash = @hash
          @block.save

          # Reset fields
          @block.fields_hash = nil
          @block.fields.reload
        end

        it "should return the original hash" do
          assert_equal @hash, @block.fields_hash
        end

        it "should build fields" do
          assert_equal 4, @block.fields.count

          assert_equal "colors", @block.fields[0].name
          assert_nil @block.fields[0].value
          assert_equal "list", @block.fields[0].field_type

          assert_equal "item", @block.fields[1].name
          assert_equal "Red", @block.fields[1].value
          assert_equal "text", @block.fields[1].field_type

          assert_equal "item", @block.fields[2].name
          assert_equal "Green", @block.fields[2].value
          assert_equal "text", @block.fields[2].field_type

          assert_equal "item", @block.fields[3].name
          assert_equal "Blue", @block.fields[3].value
          assert_equal "text", @block.fields[3].field_type
        end
      end

      describe "list of groups" do
        before do
          @hash = {
            colors: [
              {color: "Red"},
              {color: "Green"},
              {color: "Blue"}
            ]
          }
          @block.fields_hash = @hash
          @block.save

          # Reset fields
          @block.fields_hash = nil
          @block.fields.reload
        end

        it "should return the original hash" do
          assert_equal @hash, @block.fields_hash
        end

        it "should build fields" do
          assert_equal 7, @block.fields.count

          assert_equal "colors", @block.fields[0].name
          assert_nil @block.fields[0].value
          assert_equal "list", @block.fields[0].field_type

          # Red
          assert_nil @block.fields[1].name
          assert_nil @block.fields[1].value
          assert_equal "list_item", @block.fields[1].field_type

          assert_equal "color", @block.fields[2].name
          assert_equal "Red", @block.fields[2].value
          assert_equal "text", @block.fields[2].field_type

          # Green
          assert_nil @block.fields[3].name
          assert_nil @block.fields[3].value
          assert_equal "list_item", @block.fields[3].field_type

          assert_equal "color", @block.fields[4].name
          assert_equal "Green", @block.fields[4].value
          assert_equal "text", @block.fields[4].field_type

          # Blue
          assert_nil @block.fields[5].name
          assert_nil @block.fields[5].value
          assert_equal "list_item", @block.fields[5].field_type

          assert_equal "color", @block.fields[6].name
          assert_equal "Blue", @block.fields[6].value
          assert_equal "text", @block.fields[6].field_type
        end
      end

      describe "list of nested groups" do
        before do
          @hash = {
            embeds: [
              {title: "Red",
               embed: {
                 html: "https://example.com"
               }},
              {title: "Green",
               embed: {
                 html: "https://example.com"
               }},
              {title: "Blue",
               embed: {
                 html: "https://example.com"
               }}
            ]
          }
          @block.fields_hash = @hash
          @block.save

          # Reset fields
          @block.fields_hash = nil
          @block.fields.reload
        end

        it "should return the original hash" do
          assert_equal @hash, @block.fields_hash
        end

        it "should build fields" do
          assert_equal 13, @block.fields.count

          assert_equal "embeds", @block.fields[0].name
          assert_nil @block.fields[0].value
          assert_equal "list", @block.fields[0].field_type

          # Embed 1
          assert_nil @block.fields[1].name
          assert_nil @block.fields[1].value
          assert_equal "list_item", @block.fields[1].field_type

          assert_equal "title", @block.fields[2].name
          assert_equal "Red", @block.fields[2].value
          assert_equal "text", @block.fields[2].field_type

          assert_equal "embed", @block.fields[3].name
          assert_nil @block.fields[3].value
          assert_equal "group", @block.fields[3].field_type

          assert_equal "html", @block.fields[4].name
          assert_equal "https://example.com", @block.fields[4].value
          assert_equal "text", @block.fields[4].field_type

          # Embed 2
          assert_nil @block.fields[5].name
          assert_nil @block.fields[5].value
          assert_equal "list_item", @block.fields[5].field_type

          assert_equal "title", @block.fields[6].name
          assert_equal "Green", @block.fields[6].value
          assert_equal "text", @block.fields[6].field_type

          assert_equal "embed", @block.fields[7].name
          assert_nil @block.fields[7].value
          assert_equal "group", @block.fields[7].field_type

          assert_equal "html", @block.fields[8].name
          assert_equal "https://example.com", @block.fields[8].value
          assert_equal "text", @block.fields[8].field_type

          # Embed 3
          assert_nil @block.fields[9].name
          assert_nil @block.fields[9].value
          assert_equal "list_item", @block.fields[9].field_type

          assert_equal "title", @block.fields[10].name
          assert_equal "Blue", @block.fields[10].value
          assert_equal "text", @block.fields[10].field_type

          assert_equal "embed", @block.fields[11].name
          assert_nil @block.fields[11].value
          assert_equal "group", @block.fields[11].field_type

          assert_equal "html", @block.fields[12].name
          assert_equal "https://example.com", @block.fields[12].value
          assert_equal "text", @block.fields[12].field_type
        end
      end

      describe "set file hash" do
        before do
          @hash = {
            image: File.open("test/files/file1.jpg")
          }
          @block.fields_hash = @hash
          @block.save

          # Reset fields
          @block.fields_hash = nil
          @block.fields.reload
        end

        it "should return the original hash" do
          assert @block.fields_hash[:image].is_a?(ActiveStorage::Attachment)
        end

        it "should build fields" do
          assert_equal 1, @block.fields.count
          assert_equal "image", @block.fields[0].name
          assert_nil @block.fields[0].value
          assert_equal "file", @block.fields[0].field_type
        end
      end

      # describe "set files hash" do
      #   before do
      #     @hash = {
      #       gallery: [
      #         File.open("test/files/file1.jpg"),
      #         File.open("test/files/file2.jpg")
      #       ]
      #     }
      #     @block.fields_hash = @hash
      #     @block.save
      #
      #     # Reset fields
      #     @block.fields_hash = nil
      #     @block.fields.reload
      #   end
      #
      #   it "should return the original hash" do
      #     assert @block.fields_hash[:gallery][0].is_a?(ActiveStorage::Attachment)
      #     assert @block.fields_hash[:gallery][1].is_a?(ActiveStorage::Attachment)
      #   end
      #
      #   it "should build fields" do
      #     assert_equal 1, @block.fields.count
      #     assert_equal "gallery", @block.fields[0].name
      #     assert_nil @block.fields[0].value
      #     assert_equal "files", @block.fields[0].field_type
      #   end
      # end
    end
  end
end
