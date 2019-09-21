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

    #IO.inspect x

    [%{name: worker_name_1}, %{name: worker_name_2}, %{name: name, type: "supervisor"}] = x

wn1 = String.to_atom(worker_name_1)
wn2 = String.to_atom(worker_name_2)
    w1 = create_worker(wn1)
    w2 = create_worker(wn2)

    wn_1 = construct_name(wn1)
    wn_2 = construct_name(wn2)

    d = create_supervisor(String.to_atom(name), [wn_1, wn_2])
    s = Macro.to_string(d)
    sw1 = Macro.to_string(w1)
    sw2 = Macro.to_string(w2)

    #IO.inspect(d)
    #IO.inspect(s)

    #{:ok, file} = File.open("test2.exs", [:write])
    #IO.binwrite(file, s)
    #File.close(file)

    json(conn, %{supervisor: s, worker_1: sw1, worker_2: sw2})
  end

  defp construct_name(name) do
    quote do
      unquote(name).Worker
    end
  end

  defp parse_node(%{"name" => name, "type" => type, "children" => []}, acc) do
    [ %{name: name, type: type} | acc]
  end
  defp parse_node(%{"children" => [child | rest]} = node, acc) do
    parse_node(child, acc) ++ parse_node(%{node | "children" => rest}, acc)
  end

  defp create_worker(name) do
    quote do
      defmodule unquote(name).Worker do
        def hello, do: "hello world!"
      end
    end
  end

  defp do_alias_stuff([h | []]) do
    quote do 
      alias unquote h 
    end
  end
  defp do_alias_stuff([h | tail]) do
    quote do 
      unquote do_alias_stuff(tail)
      alias unquote h 
    end
  end

  defp create_supervisor(name, children \\ []) do
    quote do
      defmodule unquote(name).Supervisor do
        use Supervisor

        unquote(do_alias_stuff(children))


        def start_link(opts) do
          Supervisor.start_link(__MODULE__, :ok, opts)
        end

        @impl true
        def init(:ok) do
          children = unquote(children)

          Supervisor.init(children, strategy: :one_for_one)
        end
      end
    end
  end
end
