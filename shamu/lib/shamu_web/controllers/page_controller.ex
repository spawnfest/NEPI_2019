defmodule ShamuWeb.PageController do
  use ShamuWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  # curl --header "Content-Type: application/json" -X POST --data @example.json http://localhost:4000/generate
  # will return code for supervisor
  def generate(conn, %{"data" => data} = _params) do
    #IO.inspect(params)

    #IO.inspect data
    #IO.inspect x

    #x = parse_node(data, [])

    [x] = parse_data(data, [])

    IO.inspect x

    #[%{name: worker_name_1}, %{name: worker_name_2}, %{name: name, type: "supervisor"}] = x

    #[c1, c2, c3] = x.children

    #child1_name = construct_name(c1["name"])
    #child2_name = construct_name(c2["name"])
    #child3_name = construct_name(c3["name"])
    #
    #token_cn1 = String.to_atom(child1_name)
    #token_cn2 = String.to_atom(child2_name)
    #token_cn3 = String.to_atom(child3_name)
    #wn1 = String.to_atom(worker_name_1)
    #wn2 = String.to_atom(worker_name_2)
    #w1 = create_worker(wn1)
    #w2 = create_worker(wn2)

    #wn_1 = construct_name(wn1)
    #wn_2 = construct_name(wn2)

    #d = create_supervisor(String.to_atom(x.name), [child1_name, child2_name, child3_name])
    d = create_supervisor(String.to_atom(x.name))
    s = Macro.to_string(d)
    #sw1 = Macro.to_string(w1)
    #sw2 = Macro.to_string(w2)

    #IO.inspect(d)
    #IO.inspect(s)

    #{:ok, file} = File.open("supervisor.exs", [:write])
    #IO.binwrite(file, s)
    #File.close(file)

    #{:ok, file1} = File.open("worker_1.exs", [:write])
    #IO.binwrite(file1, sw1)
    #File.close(file1)

    #{:ok, file2} = File.open("worker_2.exs", [:write])
    #IO.binwrite(file2, sw2)
    #File.close(file2)

    #json(conn, %{supervisor: s, worker_1: sw1, worker_2: sw2})
    json(conn, %{supervisor: s, worker_1: "n/a", worker_2: "n/a"})
  end

  defp construct_name(name) do
    quote do
      unquote(name).Worker
    end
  end


  defp parse_data([], acc), do: acc
  #defp parse_data([data | []], acc) do
  #  parse_worker(data, acc)
  #end
  defp parse_data([data | rest], acc) do
    parse_worker(data, acc) ++ parse_data(rest, acc)
  end

  defp parse_worker(%{"name" => name, "type" => "supervisor", "children" => children}, acc) do
    supervisor = %{
      name: name,
      children: children
    }
    [supervisor | acc]
  end
  defp parse_worker(%{"type" => "worker"}, _acc), do: []

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

  defp add_children_alias([h | []]) do
    quote do 
      alias unquote h 
    end
  end
  defp add_children_alias([h | tail]) do
    quote do 
      unquote add_children_alias(tail)
      alias unquote h 
    end
  end

  defp create_supervisor(name, children \\ []) do
    quote do
      defmodule unquote(name).Supervisor do
        use Supervisor

        unquote add_children_alias(children)


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
