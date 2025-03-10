require "view_test_case"

module Formstrap
  class RedactorViewTest < ViewTestCase
    before do
      @post = Post.new
    end

    describe "by default" do
      before do
        visit_inline locals: {post: @post} do
          <<~ERB
            <%= formstrap_form_with model: post do |form| %>
              <%= form.redactor :title %>
            <% end %>
          ERB
        end
      end

      describe "textarea" do
        it "has type textarea" do
          assert_css "textarea"
        end

        it "has bootstrap class" do
          assert_css "textarea.form-control"
        end

        it "has name" do
          assert_css "textarea[name='post[title]']"
        end

        it "has id" do
          assert_css "textarea[id='post_title']"
        end

        it "has no placeholder" do
          assert_no_css "textarea[placeholder]"
        end

        it "has validation aria" do
          assert_css "textarea[aria-describedby='title_validation']"
        end

        it "has a data-redactor-options" do
          assert_css "textarea[data-redactor-options]"
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
              <%= formstrap_form_with model: post do |form| %>
                <%= form.redactor :title %>
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
              <%= formstrap_form_with model: post do |form| %>
                <%= form.redactor :title %>
              <% end %>
            ERB
          end
        end

        it "a validation message is shown" do
          assert_css ".valid-feedback[id='title_validation']", text: ""
        end
      end
    end

    describe "with ai" do
      before do
        visit_inline locals: {post: @post} do
          <<~ERB
            <%= formstrap_form_with model: post do |form| %>
              <%= form.redactor :title, ai: true %>
            <% end %>
          ERB
        end
      end

      it "has set the ai options in the data-redactor-options" do
        redactor_options = find("textarea")[:"data-redactor-options"]
        redactor_options = JSON.parse(redactor_options)

        assert redactor_options.has_key?("ai")
      end
    end
  end
end
