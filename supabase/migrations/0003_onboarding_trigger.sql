-- Prime — Trigger de onboarding (03-backend.md)
-- Al crear un usuario nuevo: 4 áreas por defecto + su fila de perfil.
-- La función fija search_path y revoca EXECUTE a los roles expuestos por la API
-- (hardening recomendado por los advisors de Supabase para SECURITY DEFINER).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.areas (user_id, nombre, orden) values
    (new.id, 'Físico', 0),
    (new.id, 'Mental', 1),
    (new.id, 'Personal', 2),
    (new.id, 'Laboral', 3);

  insert into public.perfiles (user_id) values (new.id);

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
