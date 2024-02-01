# frozen_string_literal: true

Rails.application.routes.draw do
  namespace(:formstrap) do
    get "media", to: "media#index", as: :media
    post "media", to: "media#create", as: :new_media
    get "media/thumbnail/:id", to: "media#thumbnail", as: :media_item_thumbnail
  end
end
