-- Prime — Waitlist de la landing (captura de email pre-lanzamiento)
-- Cualquiera (anon) puede anotarse; nadie puede leer la lista vía la API (sin policy de select).

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table waitlist enable row level security;

-- Insert abierto (es una waitlist pública). Sin policy de select → no legible por la API.
create policy "anyone can join" on waitlist for insert with check (true);

grant insert on table waitlist to anon, authenticated;
