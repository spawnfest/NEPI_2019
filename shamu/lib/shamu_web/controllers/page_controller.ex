defmodule ShamuWeb.PageController do
  use ShamuWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  # curl -X POST --data "test" localhost:4000/generate
  # as for now will always respond with the same reply
  def generate(conn, params) do
    IO.inspect(params)

    json(conn, %{test: 3, second_test: "test"})
  end
end
