-- Prime — Datos demo para poder ver la pantalla "Hoy" funcionando (Día 1).
--
-- CÓMO USARLO:
--   1. Registrate en la app (el trigger crea tus 4 áreas + perfil).
--   2. Cambiá el email de abajo por el tuyo.
--   3. Corré este archivo en Supabase → SQL Editor (o `psql`).
--
-- Es seguro re-ejecutarlo: borra los hábitos/bloques previos del usuario y
-- reinserta todo (los registros viejos caen por cascade al borrar los hábitos).

do $$
declare
  v_email text := 'CAMBIAME@ejemplo.com'; -- ← PONÉ TU EMAIL
  v_user uuid;
  a_fisico uuid;
  a_mental uuid;
  a_personal uuid;
  a_laboral uuid;
  b_foco uuid;
  b_gym uuid;
  h_dormir uuid;
  h_entrenar uuid;
  h_meditar uuid;
  h_agua uuid;
  h_leer uuid;
  h_tarea uuid;
  d int;
  f date;
  dia int; -- dia_semana 0=lunes … 6=domingo
begin
  select id into v_user from auth.users where email = v_email;
  if v_user is null then
    raise exception 'No hay usuario con email %. Registrate primero en la app.', v_email;
  end if;

  -- Áreas (creadas por el trigger de onboarding)
  select id into a_fisico   from areas where user_id = v_user and nombre = 'Físico';
  select id into a_mental   from areas where user_id = v_user and nombre = 'Mental';
  select id into a_personal from areas where user_id = v_user and nombre = 'Personal';
  select id into a_laboral  from areas where user_id = v_user and nombre = 'Laboral';

  -- Limpieza para re-ejecución idempotente (registros caen por cascade)
  delete from habitos where user_id = v_user;
  delete from rutina_bloques where user_id = v_user;

  -- ── Bloques de rutina: misma rutina los 7 días (así "Ahora" siempre encuentra bloque) ──
  for dia in 0..6 loop
    insert into rutina_bloques (user_id, dia_semana, hora_inicio, hora_fin, titulo, descripcion, area_id) values
      (v_user, dia, '08:00', null,    'Despierto',      'Arranca el día',       null),
      (v_user, dia, '08:00', '08:30', 'Leer',           'Lectura de la mañana', a_personal),
      (v_user, dia, '09:00', '13:30', 'Bloque de foco', 'Trabajo',              a_laboral),
      (v_user, dia, '13:30', '14:30', 'Almuerzo',       null,                   null),
      (v_user, dia, '18:30', '19:30', 'Gym',            'Entrenamiento',        a_fisico),
      (v_user, dia, '22:00', '22:30', 'Boxeo',          null,                   a_fisico);
  end loop;

  -- Un foco y un gym (lunes) para vincular hábitos (muestra el ícono de cadena)
  select id into b_foco from rutina_bloques where user_id = v_user and dia_semana = 0 and titulo = 'Bloque de foco';
  select id into b_gym  from rutina_bloques where user_id = v_user and dia_semana = 0 and titulo = 'Gym';

  -- ── Hábitos (uno o dos por área, cubriendo los 3 tipos de control) ──
  insert into habitos (user_id, area_id, nombre, tipo, meta, unidad, incremento_rapido, frecuencia, bloque_id)
    values (v_user, a_fisico, 'Dormir 8 horas', 'booleano', null, null, null, '{0,1,2,3,4,5,6}', null)
    returning id into h_dormir;
  insert into habitos (user_id, area_id, nombre, tipo, meta, unidad, incremento_rapido, frecuencia, bloque_id)
    values (v_user, a_fisico, 'Entrenar', 'booleano', null, null, null, '{0,1,2,3,4,5}', b_gym)
    returning id into h_entrenar;
  insert into habitos (user_id, area_id, nombre, tipo, meta, unidad, incremento_rapido, frecuencia, bloque_id)
    values (v_user, a_mental, 'Meditar', 'duracion', 10, 'minutos', 5, '{0,1,2,3,4,5,6}', null)
    returning id into h_meditar;
  insert into habitos (user_id, area_id, nombre, tipo, meta, unidad, incremento_rapido, frecuencia, bloque_id)
    values (v_user, a_personal, 'Tomar agua', 'numerico', 2, 'L', 0.25, '{0,1,2,3,4,5,6}', null)
    returning id into h_agua;
  insert into habitos (user_id, area_id, nombre, tipo, meta, unidad, incremento_rapido, frecuencia, bloque_id)
    values (v_user, a_personal, 'Leer', 'numerico', 20, 'páginas', 5, '{0,1,2,3,4,5,6}', null)
    returning id into h_leer;
  insert into habitos (user_id, area_id, nombre, tipo, meta, unidad, incremento_rapido, frecuencia, bloque_id)
    values (v_user, a_laboral, 'Tarea de estudio', 'booleano', null, null, null, '{0,1,2,3,4}', b_foco)
    returning id into h_tarea;

  -- ── Historial: últimos 20 días con algunas fallas para que las métricas sean realistas ──
  for d in 1..20 loop
    f := current_date - d;
    dia := extract(isodow from f)::int - 1; -- 1..7 (lun..dom) → 0..6

    if random() < 0.9 then
      insert into registros (user_id, habito_id, fecha, valor) values (v_user, h_dormir, f, 1)
        on conflict (habito_id, fecha) do nothing;
    end if;

    if dia <> 6 and random() < 0.8 then -- Entrenar: lun-sáb
      insert into registros (user_id, habito_id, fecha, valor) values (v_user, h_entrenar, f, 1)
        on conflict (habito_id, fecha) do nothing;
    end if;

    insert into registros (user_id, habito_id, fecha, valor)
      values (v_user, h_meditar, f, case when random() < 0.75 then 10 else 5 end)
      on conflict (habito_id, fecha) do nothing;

    insert into registros (user_id, habito_id, fecha, valor)
      values (v_user, h_agua, f, case when random() < 0.85 then 2 else 1.25 end)
      on conflict (habito_id, fecha) do nothing;

    insert into registros (user_id, habito_id, fecha, valor)
      values (v_user, h_leer, f, case when random() < 0.8 then 20 else 10 end)
      on conflict (habito_id, fecha) do nothing;

    if dia <= 4 and random() < 0.85 then -- Tarea: lun-vie
      insert into registros (user_id, habito_id, fecha, valor) values (v_user, h_tarea, f, 1)
        on conflict (habito_id, fecha) do nothing;
    end if;
  end loop;

  -- ── HOY: estado parcial (matchea los mockups del checklist) ──
  insert into registros (user_id, habito_id, fecha, valor) values
    (v_user, h_dormir, current_date, 1),    -- hecho
    (v_user, h_agua,   current_date, 1.25), -- 1.25 / 2 L
    (v_user, h_leer,   current_date, 12)    -- 12 / 20 páginas
    on conflict (habito_id, fecha) do nothing;
  -- Meditar, Entrenar y Tarea quedan pendientes hoy.

  raise notice 'Seed OK para % (user %).', v_email, v_user;
end $$;
