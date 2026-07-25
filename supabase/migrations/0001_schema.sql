-- Prime — Esquema base (03-backend.md)
-- 5 tablas: areas, rutina_bloques, habitos, registros, perfiles + índices.
-- Cada tabla lleva su propia columna user_id (patrón recomendado por Supabase para RLS).

-- ÁREAS
create table if not exists areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nombre text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- BLOQUES DE RUTINA (horario semanal)
create table if not exists rutina_bloques (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  dia_semana int not null check (dia_semana between 0 and 6), -- 0 = lunes ... 6 = domingo
  hora_inicio time not null,
  hora_fin time, -- nullable: eventos puntuales sin duración (ej. "Despierto")
  titulo text not null,
  descripcion text,
  area_id uuid references areas(id) on delete set null,
  created_at timestamptz not null default now()
);

-- HÁBITOS
create table if not exists habitos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  area_id uuid references areas(id) on delete cascade not null,
  nombre text not null,
  tipo text not null check (tipo in ('booleano', 'numerico', 'duracion', 'escala')) default 'booleano',
  meta numeric, -- null para tipo booleano (meta implícita = 1)
  unidad text, -- ej. 'páginas', 'litros', 'minutos'
  incremento_rapido numeric, -- ej. 0.25 (litros) para el botón "+" de registro rápido
  frecuencia int[] not null default '{0,1,2,3,4,5,6}', -- días de la semana en que aplica
  bloque_id uuid references rutina_bloques(id) on delete set null, -- opcional: vínculo a un bloque
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- REGISTROS (check-ins diarios)
create table if not exists registros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  habito_id uuid references habitos(id) on delete cascade not null,
  fecha date not null,
  valor numeric not null default 0, -- 0/1 para booleano; cantidad para numerico/duracion; 1-5 escala
  nota text,
  created_at timestamptz not null default now(),
  unique (habito_id, fecha) -- un solo registro por hábito por día (se actualiza con upsert)
);

-- PERFILES (1 fila por usuario)
create table if not exists perfiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  prioridades text[] not null default '{}', -- array ordenado, ej. 4 strings
  frase text,
  tema text not null default 'sistema' check (tema in ('claro', 'oscuro', 'sistema')),
  updated_at timestamptz not null default now()
);

-- Índices
create index if not exists rutina_bloques_user_dia_idx on rutina_bloques (user_id, dia_semana);
create index if not exists habitos_area_idx on habitos (area_id);
create index if not exists registros_habito_fecha_idx on registros (habito_id, fecha);
