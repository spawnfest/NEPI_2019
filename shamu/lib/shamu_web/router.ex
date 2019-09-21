defmodule ShamuWeb.Router do
  use ShamuWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug CORSPlug, origin: "*"
  end

  scope "/", ShamuWeb do
    pipe_through :browser

    get "/", PageController, :index
  end

  scope "/generate/", ShamuWeb do
    pipe_through :api

    post "/", PageController, :generate
    options "/", PageController, :nothing
  end

  # Other scopes may use custom stacks.
  # scope "/api", ShamuWeb do
  #   pipe_through :api
  # end
end
