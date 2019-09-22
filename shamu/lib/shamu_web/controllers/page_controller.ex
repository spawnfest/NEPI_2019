defmodule ShamuWeb.PageController do
  use ShamuWeb, :controller
  alias Shamu.CodeGeneration, as: CodeGen

  def index(conn, _params) do
    render(conn, "index.html")
  end

  # curl --header "Content-Type: application/json" -X POST --data @example2.json http://localhost:4000/generate
  # will return code for supervisor
  def generate(conn, %{"data" => data}) do
    workers = 
      data
      |> CodeGen.parse_data([])
      |> CodeGen.create_code([])
    json(conn, %{result: workers})
  end
end
