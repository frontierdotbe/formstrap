module Headmin
  module Filter
    class Base
      # Constants
      OPERATORS = %w[eq not_eq gt gteq lt lteq between not_between in not_in matches does_not_match is_null is_not_null starts_with ends_with]

      OPERATORS_CONVERT_TO = {
        convert_to_range: %w[between not_between],
        convert_to_array: %w[in not_in in_all in_any],
        convert_to_value: %w[eq not_eq gt gteq lt lteq matches does_not_match is_null is_not_null starts_with ends_with]
      }

      QUERY_VALUE_CONVERT_TO = {
        convert_value_to_match: %w[matches does_not_match],
        convert_to_starts: %w[starts_with],
        convert_to_ends: %w[ends_with]
      }

      QUERY_OPERATOR_CONVERT_TO = {
        matches: %w[starts_with ends_with]
      }

      # Methods
      def initialize(attribute, params, association: nil)
        @attribute = association ? "#{association}_#{attribute}".to_sym : attribute
        @raw_value = params[@attribute]
        @association = association
        @instructions = []

        if params.key?(@attribute)
          parse(@raw_value)
        end
      end

      attr_reader :raw_value
      attr_reader :attribute

      def values
        @instructions.map { |instruction| instruction[:value] }.compact
      end

      def operators
        @instructions.map { |instruction| instruction[:operator] }.compact
      end

      def conditionals
        @instructions.map { |instruction| instruction[:conditional] }.compact
      end

      def string(display_values = [])
        build_instructions_string(display_values)
      end

      attr_reader :instructions

      def query(collection)
        return collection unless @instructions.any?

        query = nil

        @instructions.each do |instruction|
          query = build_query(query, collection, instruction)
        end

        collection = collection.joins(@association) if @association
        collection.distinct.where(query)
      end

      def cast_value(value)
        # This method has to be implemented by the child.

        raise NotImplementedMethodError, "Method cast_value has to be implemented by its child."
      end

      def display_value(value)
        value
      end

      def build_query(query, collection, instruction)
        query_operator = convert_to_query_operator(instruction[:operator])
        query_value = convert_to_query_value(instruction[:value], instruction[:operator])

        query_operator, query_value = process_null_operators(query_operator, query_value)

        model = collection.is_a?(Class) ? collection : collection.model

        if @association
          # Association attributes are passed through as {association}_{attribute}, so we need to transform this into {attribute}
          new_attribute = attribute.to_s.gsub("#{@association}_", "").to_sym
          new_model = model.reflect_on_association(@association)

          # In case the association cannot be found, raise a well defined error
          raise UnknownAssociation if new_model.nil?

          new_query = new_model.klass.arel_table[new_attribute].send(query_operator, query_value)
        else
          new_query = model.arel_table[attribute].send(query_operator, query_value)
        end

        query ? query.send(instruction[:conditional], new_query) : new_query
      end

      def is_i?(value)
        # Regex: this selects signed digits (\d) only, it is then checked to the value, e.g.:
        # is_i?("3") = true
        # is_i?("-3") = true
        # is_i?("3a") = false
        # is_i?("3.2") = false

        /\A[-+]?\d+\z/.match(value)
      end

      private

      def parse(string)
        instructions = split_instructions(string)
        parse_instructions(instructions)
      end

      def split_instructions(string)
        # Regex: It divides the string into separate parts:
        # - Parts starting with +AND+ OR +OR+ until the next occurrence of +
        # - First part of the string till the first occurrence of +
        string.scan(/\+AND\+[^+]* | \+OR\+[^+]* | ^[^+]*/x)
      end

      def parse_instructions(instructions)
        instructions.map { |instruction| parse_instruction(instruction) }
      end

      def parse_instruction(string)
        conditional_raw, operator_raw, value_raw = split_instruction(string)

        conditional = parse_conditional(conditional_raw)
        operator = parse_operator(operator_raw, value_raw)
        value = parse_value(value_raw, operator)

        @instructions << {conditional: conditional, operator: operator, value: value}
      end

      def split_instruction(string)
        # Regex: takes out the +AND+ / +OR+, if not found returns nil
        conditional_raw = string.scan(/\+AND\+|\+OR\+/)[0]

        string = string.remove("+AND+").remove("+OR+")

        # Regex: takes out the value before the : character
        operator_raw = (string.match(/^[^:]*/)[0] == string) ? nil : string.match(/^[^:]*/)[0]
        value_raw = string.remove("#{operator_raw}:")

        [conditional_raw, operator_raw, value_raw]
      end

      def parse_conditional(string)
        string.present? ? string.delete("+").downcase : nil
      end

      def parse_operator(string, value)
        if self.class::OPERATORS.include?(string)
          # Operator is recognized, return the operator
          string
        elsif string.nil?
          # There was no operator present, default operator is eq
          "eq"
        else
          # There was an operator passed but it was not recognized, raise exception
          raise OperatorNotSupportedError, "This operator is not supported by this filter."
        end
      end

      def parse_value(string, operator)
        if operator == "is_null" || operator == "is_not_null"
          return string.to_i
        end
        process_value(string, operator)
      end

      def process_null_operators(operator, value)
        # In case of null operators (is_null and is_not_null), we have to intercept the operator and value values
        # and transform them to the correct operator (eq or not_eq) and value (nil)
        if operator == "is_null" && value == 1
          ["eq", nil]
        elsif operator == "is_null" && value == 0
          ["not_eq", nil]
        elsif operator == "is_not_null" && value == 1
          ["not_eq", nil]
        elsif operator == "is_not_null" && value == 0
          ["eq", nil]
        else
          [operator, value]
        end
      end

      def convert_to_range(value)
        array = value.split(",")
        cast_value(array[0])..cast_value(array[1])
      end

      def convert_to_array(value)
        array = value.split(",")
        array.map { |e| cast_value(e) }
      end

      def convert_to_value(value)
        cast_value(value)
      end

      def convert_to_query_value(value, operator)
        value_converter = self.class::QUERY_VALUE_CONVERT_TO.find { |key, values| values.include?(operator) }&.first

        if value_converter.present?
          send(value_converter, value)
        else
          value
        end
      end

      def convert_value_to_match(value)
        "%#{value}%"
      end

      def convert_to_query_operator(operator)
        self.class::QUERY_OPERATOR_CONVERT_TO.find { |key, values| values.include?(operator) }&.first || operator
      end

      def match_operator_with_convert(operator)
        self.class::OPERATORS_CONVERT_TO.find { |key, values| values.include?(operator) }&.first
      end

      def process_value(value, operator)
        send(match_operator_with_convert(operator), value)
      end

      def build_instructions_string(display_values)
        strings = @instructions.map { |instruction| build_instruction_string(instruction, display_values) }
        strings.join(" ")
      end

      def build_instruction_string(instruction, display_values)
        conditional = instruction[:conditional].present? ? "#{I18n.t("headmin.filters.conditionals.#{instruction[:conditional]}")} " : nil
        operator = I18n.t("headmin.filters.operators.#{instruction[:operator]}")

        display_value = instruction[:value].is_a?(Array) ? instruction[:value].first.to_s : instruction[:value]

        value = display_values[:display_values].find { |item| item.second.to_s == display_value }
        value = value.present? ? value.first : instruction[:value]

        value = if instruction[:operator] == "is_null" || instruction[:operator] == "is_not_null"
          # In case of special operators (is_null & is_not_null), we intercept the value
          (value == 1) ? I18n.t("headmin.filters.values.yes") : I18n.t("headmin.filters.values.no")
        else
          display_value(value)
        end

        "#{conditional}#{operator} &ldquo;#{value}&rdquo;"
      end
    end

    class OperatorNotSupportedError < StandardError
    end

    class NotImplementedMethodError < StandardError
    end

    class UnknownAssociation < StandardError
    end
  end
end
