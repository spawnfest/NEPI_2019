defmodule ShamuWeb.PageController do
  use ShamuWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  # curl -X POST --data "test" localhost:4000/generate
  # as for now will always respond with the same reply
  def generate(conn, %{"data" => data} = _params) do
    #IO.inspect(params)

    #IO.inspect data
    #IO.inspect x

    x = parse_node(data, [])

    IO.inspect x

    [_, %{name: name, type: "worker"}, _] = x

    d = create_worker(String.to_atom(name))

    s = Macro.to_string(d)

    IO.inspect(d)
    IO.inspect(s)

    #{:ok, file} = File.open("test2.exs", [:write])
    #IO.binwrite(file, s)
    #File.close(file)

    json(conn, s)
  end

  defp parse_node(%{"name" => name, "type" => type, "children" => []}, acc) do
    [ %{name: name, type: type} | acc]
  end
  defp parse_node(%{"children" => [child | rest]} = node, acc) do
    parse_node(child, acc) ++ parse_node(%{node | "children" => rest}, acc)
  end

  defp create_worker(name) do
    quote do
      defmodule unquote(name) do
        def hello(), do: "hello, world!"
      end
    end
  end
end
