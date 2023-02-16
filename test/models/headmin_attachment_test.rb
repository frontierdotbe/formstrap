require "test_helper"

class HeadminAttachmentTest < ActiveSupport::TestCase
  describe "Image Attachment returns correct Record Hierarchy" do
    it "when attached to a single resource" do
      # Hierarchy
      # - Post
      # -- Attachment

      attachment = active_storage_attachments(:image_1)

      assert_equal([attachment.record], attachment.record_hierarchy)
    end

    it "when attached to a field" do
      # Hierarchy
      # - Field
      # -- Attachment

      field = fields(:image)
      field.rebuild!
      attachment = active_storage_attachments(:image_2)

      record_hierarchy = [field]
      assert_equal(record_hierarchy, attachment.record_hierarchy)
    end

    it "when attached to a single field which is attached to a block which is attached to a page" do
      # Hierarchy
      # - Page
      # -- Block
      # --- Field
      # ---- Attachment

      page = pages(:home)
      block = Block.new(name: :image)
      field = fields(:image)
      attachment = active_storage_attachments(:image_2)

      page.blocks << block
      block.fields << field
      field.rebuild!

      record_hierarchy = [field, block, page]
      assert_equal(record_hierarchy, attachment.record_hierarchy)
    end

    it "when attached to a field which is part of a field (group) which is attached to a block which is attached to a page" do
      # Hierarchy
      # - Page
      # -- Block
      # --- Group
      # ---- Field
      # ----- Attachment

      page = pages(:home)
      block = Block.new(name: :image)
      group = Field.new(field_type: :group)
      field = fields(:image)
      field.update(parent: group)
      attachment = active_storage_attachments(:image_2)

      page.blocks << block
      block.fields << group
      field.rebuild!

      record_hierarchy = [field, group, block, page]
      assert_equal(record_hierarchy, attachment.record_hierarchy)
    end
  end
end
