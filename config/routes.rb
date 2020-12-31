Rails.application.routes.draw do
  get 'home/index'
  root 'home#index'

  resources :campaigns
  resources :users
  resources :sessions, only: %i[new create destroy]
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'
end
