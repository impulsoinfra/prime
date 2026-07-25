# Prime

App personal de organización diaria y seguimiento de hábitos.
**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Supabase · Tabler Icons.

Ver `specs/` para la visión de producto (`01-proyecto.md`), el sistema de diseño
(`02-diseno-ui.md`) y el backend (`03-backend.md`).

---

## Puesta en marcha (una vez)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copiá `.env.example` a `.env.local` y completá con los datos de tu proyecto Supabase
(Dashboard → Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # opcional por ahora
```

### 3. Base de datos

En **Supabase → SQL Editor**, corré en orden los archivos de `supabase/migrations/`:

1. `0001_schema.sql` — las 5 tablas + índices
2. `0002_rls.sql` — Row Level Security + políticas
3. `0003_onboarding_trigger.sql` — trigger que crea las 4 áreas + perfil al registrarse

> Si usás la CLI de Supabase: `supabase db push` aplica las migraciones de esa carpeta.

### 4. Desactivar confirmación de email (solo para desarrollo)

En **Supabase → Authentication → Settings**, desactivá "Confirm email" para poder
registrarte y entrar sin el paso de confirmación. **Reactivalo antes de producción.**

### 5. Datos demo (para ver la pantalla "Hoy" con contenido)

1. Levantá la app y **registrate** (esto dispara el trigger que crea tus áreas + perfil).
2. Abrí `supabase/seed.sql`, cambiá `CAMBIAME@ejemplo.com` por **tu email**.
3. Corré `seed.sql` en el SQL Editor. Carga hábitos, bloques de rutina y ~3 semanas
   de historial para que las métricas, rachas y barras semanales tengan sentido.
   Es idempotente (se puede re-ejecutar).

---

## Desarrollo

```bash
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run typecheck  # tsc --noEmit
npm run lint
```

---

## Estado (Día 1 del MVP)

Implementado:

- Setup del proyecto + sistema de diseño (tokens CSS claro/oscuro, dark mode automático).
- Migraciones SQL (5 tablas + RLS + trigger de onboarding).
- Auth: registro / login / logout con Supabase Auth (+ gate por middleware).
- Layout responsive: **bottom nav** en mobile, **sidebar** en desktop (colapsada a íconos
  en el breakpoint intermedio).
- Pantalla **Hoy** completa: saludo, tarjetas de métricas, tarjeta "Ahora" (reloj en vivo),
  línea de tiempo del día, progreso por área (barras segmentadas) y checklist de hábitos
  con los 3 controles (booleano, cantidad con "+", duración con timer) y UI optimista.

Pendiente (Día 2): pantallas Progreso, Rutina y Perfil; modal "Nuevo hábito"; control de
tipo `escala`; deploy en Vercel.
