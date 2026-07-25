-- Prime — Row Level Security (03-backend.md)
-- Cada usuario solo ve y modifica lo suyo (auth.uid() = user_id).

alter table areas enable row level security;
alter table rutina_bloques enable row level security;
alter table habitos enable row level security;
alter table registros enable row level security;
alter table perfiles enable row level security;

-- AREAS
create policy "select own" on areas for select using (auth.uid() = user_id);
create policy "insert own" on areas for insert with check (auth.uid() = user_id);
create policy "update own" on areas for update using (auth.uid() = user_id);
create policy "delete own" on areas for delete using (auth.uid() = user_id);

-- RUTINA_BLOQUES
create policy "select own" on rutina_bloques for select using (auth.uid() = user_id);
create policy "insert own" on rutina_bloques for insert with check (auth.uid() = user_id);
create policy "update own" on rutina_bloques for update using (auth.uid() = user_id);
create policy "delete own" on rutina_bloques for delete using (auth.uid() = user_id);

-- HABITOS
create policy "select own" on habitos for select using (auth.uid() = user_id);
create policy "insert own" on habitos for insert with check (auth.uid() = user_id);
create policy "update own" on habitos for update using (auth.uid() = user_id);
create policy "delete own" on habitos for delete using (auth.uid() = user_id);

-- REGISTROS
create policy "select own" on registros for select using (auth.uid() = user_id);
create policy "insert own" on registros for insert with check (auth.uid() = user_id);
create policy "update own" on registros for update using (auth.uid() = user_id);
create policy "delete own" on registros for delete using (auth.uid() = user_id);

-- PERFILES (comparado contra la propia PK)
create policy "select own profile" on perfiles for select using (auth.uid() = user_id);
create policy "insert own profile" on perfiles for insert with check (auth.uid() = user_id);
create policy "update own profile" on perfiles for update using (auth.uid() = user_id);
