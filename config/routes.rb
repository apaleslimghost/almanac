Rails.application.routes.draw do
  get 'unsplash/search'
  get 'home/index'
  root 'home#index'

  resources :campaigns do
    resources :users, only: :index
    resources :cards

    scope module: 'card_type' do
      resources :quests
      resources :objectives
      resources :locations
    end
  end

  resources :users, except: :index
  resources :sessions, only: %i[new create destroy]

  get 'sign-up', to: 'users#new', as: 'signup'
  get 'log-in', to: 'sessions#new', as: 'login'
  get 'log-out', to: 'sessions#destroy', as: 'logout'
end
