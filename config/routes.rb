Rails.application.routes.draw do
  get 'links/create'
  get 'links/destroy'
  get 'unsplash/search'
  get 'home/index'
  root 'home#index'

  resources :campaigns do
    resources :cards

    scope module: 'card_type' do
      resources :quests
      resources :objectives
      resources :locations
    end
  end

  resources :users
  resources :sessions, only: %i[new create destroy]
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
end
