require "view_test_case"

class HeadminHeadingTest < ViewTestCase
  describe "with title" do
    before do
      visit_inline do
        <<~ERB
          <%= render "headmin/heading" do %>
            Custom title
          <% end %>
        ERB
      end
    end

    it "shows the title" do
      assert_selector ".h-heading", text: "Custom title"
    end
  end
end
