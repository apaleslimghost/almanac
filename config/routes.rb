Rails.application.routes.draw do
  get 'links/create'
  get 'links/destroy'
  get 'home/index'
  root 'home#index'

  resources :campaigns do
    resources :cards do
      resources :links, only: %i[create destroy]
    end

    resources :quests
  end

  resources :users
  resources :sessions, only: %i[new create destroy]
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
end
