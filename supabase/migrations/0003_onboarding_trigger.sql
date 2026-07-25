-- Prime — Trigger de onboarding (03-backend.md)
-- Al crear un usuario nuevo: 4 áreas por defecto + su fila de perfil.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.areas (user_id, nombre, orden) values
    (new.id, 'Físico', 0),
    (new.id, 'Mental', 1),
    (new.id, 'Personal', 2),
    (new.id, 'Laboral', 3);

  insert into public.perfiles (user_id) values (new.id);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
