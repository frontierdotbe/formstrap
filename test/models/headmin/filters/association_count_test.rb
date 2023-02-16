require "test_helper"

module Headmin
  module Filter
    class AssociationCountTest < ActiveSupport::TestCase
      describe "#raw_value" do
        it "returns the original parameter string" do
          filter = Headmin::Filter::AssociationCount.new(:questions_count, {questions_count: "gt:0"})
          assert_equal "gt:0", filter.raw_value
        end
      end

      describe "#values" do
        it "parses the values" do
          filter = Headmin::Filter::AssociationCount.new(:questions_count, {questions_count: "gt:0"})
          assert_equal [0], filter.values
        end
      end

      describe "#operators" do
        it "parses the operators" do
          filter = Headmin::Filter::AssociationCount.new(:questions_count, {questions_count: "gt:0"})
          assert_equal ["gt"], filter.operators
        end
      end

      describe "#query" do
        describe "with has_many relationships" do
          before do
            @poll_without_questions = Poll.create
            @poll_with_1_question = Poll.create(questions: [Question.new])
            @poll_with_2_questions = Poll.create(questions: [Question.new, Question.new])
          end

          describe "for parameter gt:0" do
            it "returns all records with associations" do
              filter = Headmin::Filter::AssociationCount.new(:questions_count, {questions_count: "gt:0"})
              collection = filter.query(Poll).to_a

              assert_equal [@poll_with_1_question, @poll_with_2_questions], collection
            end
          end

          describe "for parameter gt:1" do
            it "returns all records with more than 1 association" do
              filter = Headmin::Filter::AssociationCount.new(:questions_count, {questions_count: "gt:0"})
              collection = filter.query(Poll).to_a

              assert_equal [@poll_with_1_question, @poll_with_2_questions], collection
            end
          end

          describe "for parameter eq:0" do
            it "returns all records with no associations" do
              filter = Headmin::Filter::AssociationCount.new(:questions_count, {questions_count: "eq:0"})
              collection = filter.query(Poll).to_a

              assert_equal [@poll_without_questions], collection
            end
          end

          describe "for parameter not_eq:0" do
            it "returns all records with associations" do
              filter = Headmin::Filter::AssociationCount.new(:questions_count, {questions_count: "not_eq:0"})
              collection = filter.query(Poll).to_a

              assert_equal [@poll_with_1_question, @poll_with_2_questions], collection
            end
          end
        end

        describe "with has_one relationship" do
          before do
            @poll_without_survey = Poll.create
            @poll_with_survey = Poll.create(survey: Survey.new)
          end

          describe "for parameter eq:0" do
            it "returns all records without an association" do
              filter = Headmin::Filter::AssociationCount.new(:survey_count, {survey_count: "eq:0"})

              assert_equal [@poll_without_survey], filter.query(Poll).to_a
            end
          end

          describe "for parameter not_eq:0" do
            it "returns all records with an association" do
              filter = Headmin::Filter::AssociationCount.new(:survey_count, {survey_count: "not_eq:0"})

              assert_equal [@poll_with_survey], filter.query(Poll).to_a
            end
          end
        end

        describe "with an invalid association" do
          it "raises a UnknownAssociation" do
            filter = Headmin::Filter::AssociationCount.new(:invalid_count, {invalid_count: "eq:0"})

            assert_raises(Headmin::Filter::UnknownAssociation) { filter.query(Poll).to_a }
          end
        end
      end
    end
  end
end
