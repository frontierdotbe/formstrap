require "view_test_case"

module Headmin
  module Form
    class BlocksViewTest < ViewTestCase
      describe "For a record without blocks" do
        before do
          @post = Post.new
        end

        describe "by default" do
          before do
            visit_inline locals: {post: @post} do
              <<~ERB
                <%= form_with model: post do |form| %>
                  <%= render "headmin/forms/blocks", form: form, names: %w(intro body outro) %>
                <% end %>
              ERB
            end
          end

          it "has buttons" do
            assert_css("[data-template-name=\"intro\"]", text: "Intro")
            assert_css("[data-template-name=\"body\"]", text: "Body")
            assert_css("[data-template-name=\"outro\"]", text: "Outro")
          end

          it "has no blocks" do
            assert_no_css("input[id^='post_blocks_attributes_'][id$='_name']", visible: false)
          end
        end
      end

      describe "For a record with blocks" do
        before do
          @post = posts(:welcome)
        end

        describe "by default" do
          before do
            visit_inline locals: {post: @post} do
              <<~ERB
                <%= form_with model: post do |form| %>
                  <%= render "headmin/forms/blocks", form: form, names: %w(intro body outro) %>
                <% end %>
              ERB
            end
          end

          it "has buttons" do
            assert_css("[data-template-name=\"intro\"]", text: "Intro")
            assert_css("[data-template-name=\"body\"]", text: "Body")
            assert_css("[data-template-name=\"outro\"]", text: "Outro")
          end

          it "has blocks" do
            values = find_all("input[id^='post_blocks_attributes_'][id$='_name']", visible: false).map(&:value)
            assert_equal %w[intro body outro].sort, values.sort
          end
        end
      end
    end
  end
end
