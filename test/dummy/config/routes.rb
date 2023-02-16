Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  devise_for :users, controllers: {
    sessions: "auth/sessions",
    registrations: "auth/registrations",
    passwords: "auth/passwords",
    unlocks: "auth/unlocks",
    confirmations: "auth/confirmations"
  }

  localized do
    namespace(:admin) do
      root "main#index"

      resources :pages do
        collection do
          delete "bulk_destroy", as: :destroy
        end
      end

      resources :posts

      resources :polls do
        collection do
          patch "positions", as: :positions
          get "bulk_export", as: :export
          post "bulk_flash", as: :flash
          delete "bulk_destroy", as: :destroy
        end
      end

      resources :questions

      resources :users do
        collection do
          delete "bulk_destroy", as: :destroy
        end
      end

      resources :settings, except: [:new]

      resources :users do
        collection do
          delete "bulk_destroy", as: :destroy
        end
      end
    end

    scope module: "website" do
      root "main#index"
      resources :posts

      constraints(PageConstraint.new) do
        # Slug can be anything but must be passed through as param
        get "*slug", to: "pages#show", as: :page, constraints: {slug: /(.*)/}
      end
    end
  end
end
