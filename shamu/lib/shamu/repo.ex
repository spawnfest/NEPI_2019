defmodule Shamu.Repo do
  use Ecto.Repo,
    otp_app: :shamu,
    adapter: Ecto.Adapters.Postgres
end
