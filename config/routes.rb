# frozen_string_literal: true

Rails.application.routes.draw do
  namespace(:headmin) do
    get "media", to: "media#index", as: :media
    post "media", to: "media#create", as: :new_media
    get "media/:id", to: "media#show", as: :media_item
    patch "media/:id", to: "media#update"
    get "media/thumbnail/:id", to: "media#thumbnail", as: :media_item_thumbnail
  end
end
