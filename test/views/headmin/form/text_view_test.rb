require "view_test_case"

module Headmin
  module Form
    class TextViewTest < ViewTestCase
      before do
        @post = Post.new
      end

      describe "by default" do
        before do
          visit_inline locals: {post: @post} do
            <<~ERB
              <%= form_with model: post do |form| %>
                <%= render "headmin/forms/text", form: form, attribute: :title %>
              <% end %>
            ERB
          end
        end

        describe "input" do
          it "has type text" do
            assert_css "input[type='text']"
          end

          it "has bootstrap class" do
            assert_css "input.form-control"
          end

          it "has name" do
            assert_css "input[name='post[title]']"
          end

          it "has id" do
            assert_css "input[id='post_title']"
          end

          it "has no placeholder" do
            assert_no_css "input[placeholder]"
          end

          it "has validation aria" do
            assert_css "input[aria-describedby='title_validation']"
          end
        end

        describe "label" do
          it "has text value" do
            assert_css "label", text: "Title"
          end

          it "has for value" do
            assert_css "label[for='post_title']"
          end
        end

        describe "wrapper" do
          it "has wrapping div with margins" do
            assert_css ".mb-3"
          end
        end
      end

      describe "after validation" do
        describe "when attribute has errors" do
          before do
            @post.errors.add(:title, "Title can't be blank")
            visit_inline locals: {post: @post} do
              <<~ERB
                <%= form_with model: post do |form| %>
                  <%= render "headmin/forms/text", form: form, attribute: :title %>
                <% end %>
              ERB
            end
          end

          it "a validation message is shown" do
            assert_css ".invalid-feedback[id='title_validation']", text: /Title can't be blank/
          end
        end

        describe "when attribute has no errors" do
          before do
            @post.errors.add(:base, "Something went wrong")
            visit_inline locals: {post: @post} do
              <<~ERB
                <%= form_with model: post do |form| %>
                  <%= render "headmin/forms/text", form: form, attribute: :title %>
                <% end %>
              ERB
            end
          end

          it "a validation message is shown" do
            assert_css ".valid-feedback[id='title_validation']", text: ""
          end
        end
      end

      describe "with float" do
        before do
          visit_inline locals: {post: @post} do
            <<~ERB
              <%= form_with model: post do |form| %>
                <%= render "headmin/forms/text", form: form, attribute: :title, float: true %>
              <% end %>
            ERB
          end
        end

        it "has the attribute name as placeholder" do
          assert_css "input[placeholder='Title']"
        end
      end

      describe "with prepend" do
        before do
          visit_inline locals: {post: @post} do
            <<~ERB
              <%= form_with model: post do |form| %>
                <%= render "headmin/forms/text", form: form, attribute: :title, prepend: "lorem" %>
              <% end %>
            ERB
          end
        end

        it "has input group with content prepended" do
          assert_css ".input-group-text ~ input"
          assert_css ".input-group-text", text: "lorem"
        end
      end

      describe "with append" do
        before do
          visit_inline locals: {post: @post} do
            <<~ERB
              <%= form_with model: post do |form| %>
                <%= render "headmin/forms/text", form: form, attribute: :title, append: "lorem" %>
              <% end %>
            ERB
          end
        end

        it "has input group with appendage" do
          assert_css "input ~ .input-group-text", text: "lorem"
        end
      end

      describe "with label" do
        before do
          visit_inline locals: {post: @post} do
            <<~ERB
              <%= form_with model: post do |form| %>
                <%= render "headmin/forms/text", form: form, attribute: :title, label: "lorem" %>
              <% end %>
            ERB
          end
        end

        it "has label with custom value" do
          assert_css "label", text: "lorem"
        end
      end

      describe "with list" do
        before do
          visit_inline locals: {post: @post} do
            <<~ERB
              <%= form_with model: post do |form| %>
                <%= render "headmin/forms/text", form: form, attribute: :title, list: [1,2,3] %>
              <% end %>
            ERB
          end
        end

        it "input has list attribute" do
          assert_css "input[list='title_list']"
        end

        it "renders a datalist node" do
          assert_css "datalist option[value='1']", text: "1"
          assert_css "datalist option[value='2']", text: "2"
          assert_css "datalist option[value='3']", text: "3"
        end
      end

      describe "without wrapper" do
        before do
          visit_inline locals: {post: @post} do
            <<~ERB
              <%= form_with model: post do |form| %>
                <%= render "headmin/forms/text", form: form, attribute: :title, wrapper: false %>
              <% end %>
            ERB
          end
        end

        it "has no wrapper" do
          assert_no_css ".mb-3"
        end
      end

      describe "with wrapper" do
        before do
          visit_inline locals: {post: @post} do
            <<~ERB
              <%= form_with model: post do |form| %>
                <%= render "headmin/forms/text", form: form, attribute: :title, wrapper: {class: "lorem", data: {test: 1}} %>
              <% end %>
            ERB
          end
        end

        it "sets attributes on wrapper" do
          assert_css ".lorem"
          assert_css "[data-test='1']"
        end
      end
    end
  end
end
