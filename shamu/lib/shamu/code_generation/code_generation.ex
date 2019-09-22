defmodule Shamu.CodeGeneration do
  defp create_worker(name) do
    quote do
      defmodule unquote(name).Worker do
        def hello, do: "hello world!"
      end
    end
  end

  defp add_children_alias([h | []]) do
    quote do
      alias unquote(h)
    end
  end

  defp add_children_alias([h | tail]) do
    quote do
      unquote(add_children_alias(tail))
      alias unquote(h)
    end
  end

  defp create_supervisor(name, children \\ []) do
    quote do
      defmodule unquote(name).Supervisor do
        use Supervisor

        unquote(add_children_alias(children))

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

  def create_code([], acc) do Enum.uniq(acc)
    acc
    #|> Enum.map(&(s/1))
    |> List.flatten
    |> Enum.uniq
  end

  def create_code([h | t], acc) do
    res =
      case h["type"] do
        "worker" -> Macro.to_string(create_worker(String.to_atom(h["name"])))
        "supervisor" -> [create_supervisor_with_children(h)] ++ [create_code(h["children"], acc)]
      end

    create_code(t, acc ++ [res])
  end

  defp create_supervisor_with_children(%{"name" => name, "children" => children}) do
    children_names = get_children_module_names(children, [])

    d = create_supervisor(String.to_atom(name), children_names)

    Macro.to_string(d)
  end

  def parse_data([], acc), do: acc
  def parse_data([data | rest], acc) do
    parse_worker(data, acc) ++ parse_data(rest, acc)
  end

  defp parse_worker(%{"type" => "supervisor"} = supervisor, acc) do
    #supervisor = %{
    #  name: name,
    #  children: children
    #}

    [supervisor | acc]
  end

  defp parse_worker(%{"type" => "worker"}, _acc), do: []
  defp get_children_module_names([], acc), do: acc

  defp get_children_module_names([h | t], acc) do
    type =
      case h["type"] do
        "worker" -> :worker
        "supervisor" -> :supervisor
        _ -> :example
      end

    get_children_module_names(t, acc ++ [construct_name(h["name"], type)])
  end

  defp construct_name(name, :worker) do
    quote do
      unquote(name).Worker
    end
  end

  defp construct_name(name, :supervisor) do
    quote do
      unquote(name).Supervisor
    end
  end

  defp construct_name(name, _) do
    quote do
      unquote(name).Example
    end
  end
end
