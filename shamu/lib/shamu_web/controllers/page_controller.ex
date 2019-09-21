defmodule ShamuWeb.PageController do
  use ShamuWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def generate(conn, params) do
    IO.inspect(params)
    render(conn, "index.html")
  end
end
