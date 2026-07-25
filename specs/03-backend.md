# Backend — Prime

## Stack

- **Supabase**: Postgres 15 + Auth + Row Level Security + Realtime (opcional, para sincronizar entre dispositivos sin refrescar)
- **Next.js**: App Router, Server Components para lectura inicial, Server Actions o Route Handlers para mutaciones, `@supabase/ssr` para manejo de sesión vía cookies (funciona en mobile y desktop sin lógica extra)

## Autenticación

- **Método**: email + contraseña vía Supabase Auth (`supabase.auth.signUp` / `signInWithPassword`). Se puede sumar magic link más adelante sin cambios de esquema.
- **Sesión multi-dispositivo**: Supabase Auth maneja JWT + refresh token automáticamente; al loguearse en un dispositivo nuevo se crea una sesión independiente, no hay trabajo adicional que hacer.
- **Confirmación de email**: para desarrollo/testing del fin de semana, desactivar la confirmación obligatoria de email en la configuración de Supabase Auth (Authentication → Settings) para poder probar rápido. Reactivar antes de producción real.
- **Recuperación de contraseña**: usar el flujo estándar de Supabase (`resetPasswordForEmail`), no requiere tabla propia.

## Esquema de base de datos

Todas las tablas (excepto `auth.users`, que gestiona Supabase) tienen una columna `user_id` propia que referencia a `auth.users(id)`, incluso cuando técnicamente se podría inferir por join (ej. `registros` → `habitos` → `user_id`). Esto es intencional: simplifica y acelera las políticas de RLS, que es el patrón recomendado por Supabase en vez de políticas basadas en joins anidados.

```sql
-- ÁREAS
create table areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nombre text not null,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

-- BLOQUES DE RUTINA (horario semanal)
create table rutina_bloques (
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
create table habitos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  area_id uuid references areas(id) on delete cascade not null,
  nombre text not null,
  tipo text not null check (tipo in ('booleano', 'numerico', 'duracion', 'escala')) default 'booleano',
  meta numeric, -- null para tipo booleano (meta implícita = 1)
  unidad text, -- ej. 'páginas', 'litros', 'minutos'
  incremento_rapido numeric, -- ej. 0.25 (litros) para el botón "+" de registro rápido
  frecuencia int[] not null default '{0,1,2,3,4,5,6}', -- días de la semana en que aplica
  bloque_id uuid references rutina_bloques(id) on delete set null, -- opcional: vínculo a un bloque de horario
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- REGISTROS (check-ins diarios)
create table registros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  habito_id uuid references habitos(id) on delete cascade not null,
  fecha date not null,
  valor numeric not null default 0, -- 0/1 para booleano; cantidad acumulada para numerico/duracion; 1-5 para escala
  nota text,
  created_at timestamptz not null default now(),
  unique (habito_id, fecha) -- un solo registro por hábito por día (se actualiza con upsert)
);

-- Índices
create index on rutina_bloques (user_id, dia_semana);
create index on habitos (area_id);
create index on registros (habito_id, fecha);
```

### Prioridades y frase motivacional (Perfil)

Se pueden guardar como columnas simples en una tabla `perfiles` (1 fila por usuario) en vez de tablas separadas, dado que son pocos campos:

```sql
create table perfiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  prioridades text[] not null default '{}', -- array ordenado, ej. 4 strings
  frase text,
  tema text not null default 'sistema' check (tema in ('claro', 'oscuro', 'sistema')),
  updated_at timestamptz not null default now()
);
```

## Row Level Security (RLS)

Activar RLS en todas las tablas y aplicar una política idéntica de "el usuario solo ve y modifica lo suyo":

```sql
alter table areas enable row level security;
alter table rutina_bloques enable row level security;
alter table habitos enable row level security;
alter table registros enable row level security;
alter table perfiles enable row level security;

-- Repetir este bloque de 4 políticas por cada tabla (áreas, rutina_bloques, habitos, registros)
create policy "select own" on areas for select using (auth.uid() = user_id);
create policy "insert own" on areas for insert with check (auth.uid() = user_id);
create policy "update own" on areas for update using (auth.uid() = user_id);
create policy "delete own" on areas for delete using (auth.uid() = user_id);

-- Para perfiles, análogo pero comparando contra la propia PK
create policy "select own profile" on perfiles for select using (auth.uid() = user_id);
create policy "update own profile" on perfiles for update using (auth.uid() = user_id);
create policy "insert own profile" on perfiles for insert with check (auth.uid() = user_id);
```

## Trigger de onboarding

Al crear un usuario nuevo, generar automáticamente las 4 áreas por defecto y su fila de perfil:

```sql
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Lógica de negocio

Se resuelve en la capa de aplicación (Next.js), no con funciones SQL complejas, para mantener el MVP simple:

- **"Cumplido" para un hábito en un día** = `valor >= meta` (tipos `numerico`/`duracion`) o `valor = 1` (tipo `booleano`). Para `escala`, definir un umbral configurable (ej. `valor >= 4` de 5) o tratarlo como informativo sin contar para el % de cumplimiento.
- **% de progreso diario** = hábitos cumplidos hoy (según `frecuencia` incluya el día actual) / hábitos programados para hoy.
- **% de cumplimiento semanal/mensual** = promedio del % diario en el rango.
- **Racha actual** = cantidad de días consecutivos hacia atrás desde hoy con % de progreso diario = 100% (o el umbral que se defina).
- **Mejor racha** = la racha más larga registrada históricamente (se puede calcular on-the-fly recorriendo `registros` agrupados por fecha, o cachear en `perfiles` si el cálculo se vuelve costoso).
- **Intensidad del calendario** (Progreso) = el % diario mapeado a 4 buckets de opacidad (ej. 0–24% / 25–49% / 50–74% / 75–100%).
- **Insight "Más constante"** = el hábito con la racha individual más larga en el período.
- **Insight "Te cuesta más"** = el hábito con el % de cumplimiento más bajo en el período (mínimo con al menos 1 día programado, para no mostrar hábitos recién creados).
- **Bloque "Ahora"** (Hoy) = buscar en `rutina_bloques` el registro donde `dia_semana` = hoy y la hora actual está entre `hora_inicio` y `hora_fin` (si `hora_fin` es null, tratarlo como un evento puntual, no como bloque activo).
- **Registro rápido de hábitos numéricos** (botón "+"): hace un `upsert` sobre `registros` sumando `incremento_rapido` al `valor` existente del día (o creando el registro si no existe).
- **"Copiar a L–V"** (Rutina): duplica todos los `rutina_bloques` del día seleccionado hacia los otros 4 días laborales, reemplazando lo que hubiera antes en esos días (confirmar con el usuario antes de sobrescribir).

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # solo uso server-side, nunca exponer al cliente
```

## Notas de implementación

- Usar `@supabase/ssr` con middleware de Next.js para refrescar la sesión en cada request y evitar que expire mientras el usuario navega.
- Las mutaciones desde el checklist de "Hoy" (marcar hábito, sumar cantidad) deben sentirse instantáneas: actualizar el estado local optimistamente y confirmar contra Supabase en segundo plano.
- Si se activa Realtime en `registros`, permite que si el usuario tiene la app abierta en dos dispositivos, un check-in en uno se refleje en el otro sin recargar.
