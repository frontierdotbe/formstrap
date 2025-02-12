class Formstrap::AiController < FormstrapController
  require "openai"
  skip_before_action :verify_authenticity_token

  def open_ai
    client = OpenAI::Client.new(
      access_token: Formstrap::Engine.configuration.open_ai_key,
    )

    data = JSON.parse(params["data"])

    response = client.chat(
      parameters: {
        model: data["model"],
        messages: data["messages"],
        temperature: 0.7
      }
    )

    render json: response.to_json
  end
end
