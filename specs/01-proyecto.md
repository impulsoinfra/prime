# Prime — App de desarrollo personal

## Objetivo

Prime es una aplicación web (mobile + desktop) para organizar el día a día y medir el progreso hacia el "prime" físico, mental, personal y laboral de una persona. Resuelve dos problemas concretos:

1. **Organizar el día**: tener una rutina de horarios clara y saber en cualquier momento qué corresponde estar haciendo.
2. **Medir el progreso real**: trackear hábitos con metas concretas (no solo sí/no) y visualizar tendencias en el tiempo (rachas, calendario de cumplimiento, progreso por área de vida).

No es un calendario genérico ni un habit tracker genérico: combina ambos conceptos en un mismo modelo de datos para que rutina y hábitos se retroalimenten.

## Concepto central

Dos entidades separadas que se relacionan entre sí:

- **Hábitos** (`habitos`): el *qué* querés lograr y en qué cantidad (ej. "Leer 20 páginas", "Tomar 2 litros de agua", "Dormir 8 horas"). Pertenecen a un área de vida (Físico, Mental, Personal, Laboral) y tienen un tipo de meta (booleano, cantidad, duración, escala).
- **Bloques de rutina** (`rutina_bloques`): el *cuándo* — bloques de horario en la semana (ej. "9:00–13:30 Trabajo", "18:30 Gym"). Un bloque puede opcionalmente estar vinculado a un hábito, de forma que completar el bloque marca el hábito como cumplido ese día.

No todos los hábitos necesitan un bloque (tomar agua o meditar no tienen un horario fijo natural) y no todos los bloques necesitan un hábito (almorzar o volver a casa son solo de horario, no se "trackean").

## Stack técnico

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend/DB**: Supabase (Postgres + Auth + Row Level Security + Realtime)
- **Gráficos**: Recharts (barras de tendencia, distribuciones)
- **Iconos**: Tabler Icons (`@tabler/icons-react`)
- **Deploy**: Vercel

Ver `02-diseno-ui.md` para el sistema visual completo y `03-backend.md` para el esquema de base de datos, autenticación y lógica de negocio.

## Pantallas

La app tiene 4 pantallas principales, accesibles vía bottom nav en mobile y sidebar en desktop: **Hoy · Progreso · Rutina · Perfil**.

### 1. Hoy (Dashboard) — ruta `/`

Vista principal, lo primero que ve el usuario al entrar.

**Contenido, de arriba hacia abajo:**
- Saludo + fecha actual
- 2-3 tarjetas de métricas: **Progreso diario** (ej. "5/8" hábitos completados hoy, es la métrica destacada/hero), **Racha actual** (días consecutivos), **Cumplimiento semanal** (% con tendencia vs. semana anterior)
- Tarjeta **"Ahora"**: compara la hora actual contra `rutina_bloques` del día y muestra el bloque en curso (título, categoría, tiempo restante, barra de progreso) y el próximo bloque. Si no hay ningún bloque activo, mostrar estado vacío ("Sin bloque programado ahora").
- **Línea de tiempo del día**: tira horizontal con todos los bloques del día, iconografía por categoría, bloque actual resaltado.
- **Progreso por área**: grilla 2x2 (Físico, Mental, Personal, Laboral), cada una con ícono, fracción de días cumplidos esta semana (ej. "6/7") y una barra segmentada de 7 días (no un anillo circular — más informativo, muestra qué días específicos se cumplieron).
- **Hábitos de hoy**: checklist con el control de registro según el `tipo` del hábito:
  - `booleano` → checkbox circular
  - `numerico`/`duracion` → barra de progreso + botón "+" que suma el `incremento_rapido` configurado (ej. +250ml de agua)
  - `duracion` sin iniciar → botón de play que arranca un timer
- Cada ítem del checklist muestra un punto de color según su área.

### 2. Progreso — ruta `/progreso`

Vista analítica, responde "¿cómo voy?" con más profundidad que el dashboard.

**Contenido:**
- Selector de rango: Semana / Mes / Año (pills)
- **Tendencia de cumplimiento**: gráfico de barras, % de cumplimiento por semana (últimas 8 semanas), la barra actual resaltada.
- **Calendario mensual**: grilla tipo calendario real (con día de la semana correcto, no un heatmap tipo GitHub sin fechas). Cada día del mes coloreado por intensidad según el % de hábitos cumplidos ese día (4 niveles de opacidad). Días futuros se muestran vacíos con borde punteado (no tienen datos aún). El día de hoy tiene un anillo distintivo. Días de meses adyacentes que completan la grilla aparecen atenuados. Navegación mes a mes con flechas.
- **Rachas**: 3 estadísticas — racha actual, mejor racha histórica, promedio de cumplimiento del período.
- **Progreso por área**: lista con barra horizontal de % por cada una de las 4 áreas.
- **Insights**: dos tarjetas calculadas automáticamente — "Más constante" (el hábito con la racha más larga) y "Te cuesta más" (el hábito con el % de cumplimiento más bajo del período). No requiere IA, es un cálculo simple sobre los datos existentes.

### 3. Rutina — ruta `/rutina`

Vista y editor de la rutina semanal.

**Contenido:**
- Selector de día: 7 círculos (L a D) con fecha, día seleccionado resaltado. Acción "Copiar a L–V" para replicar el día actual a los días laborales (evita re-crear la misma rutina 5 veces).
- **Bloques del día**: lista de `rutina_bloques` del día seleccionado, ordenados por hora. Cada fila muestra horario, título, subtítulo opcional, barra de color por área, e ícono de cadena si está vinculado a un hábito. Tocar/click abre edición (horario, título, área, vínculo a hábito). Botón "+ Agregar bloque".
- **Objetivos sin horario fijo**: lista separada de hábitos que NO tienen un bloque asignado (ej. "Tomar agua", "Meditar") — se cumplen en cualquier momento del día. Botón "+ Agregar objetivo" abre el formulario de nuevo hábito (ver más abajo).

### 4. Perfil — ruta `/perfil`

Cuenta, preferencias y configuración personal.

**Contenido:**
- Tarjeta de cuenta: avatar (iniciales), nombre, email, editar.
- Estadísticas resumen: racha actual, mejor racha, días activos totales.
- **Tus prioridades**: lista numerada (1-4) editable y reordenable (drag and drop) con las prioridades de vida definidas por el usuario (ej. "Salud física y mental", "Crecimiento personal", "Proyecto / libertad financiera", "Viajar y vivir experiencias"). Es contenido puramente personal, no afecta la lógica de la app, pero refuerza el propósito.
- **Frase motivacional**: texto corto editable por el usuario, mostrado como recordatorio personal en la app.
- **General**: gestión de áreas y hábitos (link a pantalla de administración CRUD), tema (Claro/Oscuro/Sistema), notificaciones (toggle), idioma.
- **Cuenta**: cambiar contraseña, exportar datos (JSON o CSV de `registros`), cerrar sesión.

### 5. Modal: Nuevo hábito / Nuevo objetivo

Formulario reutilizado tanto para crear hábitos desde "Objetivos sin horario" en Rutina como desde "Áreas y hábitos" en Perfil.

**Campos:**
- Nombre (texto libre)
- Área (selector de chip, una de las 4 áreas del usuario)
- Tipo (segmentado: Sí/No · Cantidad · Duración · Escala)
- Si Cantidad o Duración: Meta (número) + Unidad (select: páginas, litros, minutos, etc.) + Incremento rápido opcional
- Frecuencia (selector de días de la semana, L a D)
- Toggle "Vincular a bloque de rutina" (opcional) — si está activo, se abre un selector de `rutina_bloques` existentes del usuario

## Flujos de usuario clave

1. **Onboarding**: al registrarse, se crean automáticamente las 4 áreas por defecto (Físico, Mental, Personal, Laboral) vía trigger de base de datos. El usuario puede agregar hábitos y bloques de rutina desde cero o partir de una plantilla sugerida.
2. **Check-in diario**: desde "Hoy", tocar/completar cada hábito del checklist. Cada acción hace un upsert en `registros` (ver `03-backend.md`).
3. **Editar rutina semanal**: desde "Rutina", seleccionar día → agregar/editar bloques → opcionalmente "Copiar a L–V" para replicar.
4. **Crear hábito con meta**: desde el modal de Nuevo hábito, definir tipo + meta + unidad + frecuencia.

## Responsive

- **Mobile** (< 768px): navegación inferior fija con 4 íconos (Hoy, Progreso, Rutina, Perfil). Contenido en una sola columna, scrolleable.
- **Desktop** (≥ 1024px): sidebar fija a la izquierda con el mismo menú + logo + chip de usuario. Contenido en múltiples columnas donde el ancho lo permite (ej. "Ahora" + timeline a la izquierda, progreso por área a la derecha en Hoy; calendario + rachas en una fila y tendencia + insights debajo en Progreso).
- Breakpoint intermedio (768–1024px): sidebar colapsada a solo íconos.

## Alcance sugerido para el fin de semana (MVP)

**Día 1:**
1. Setup del proyecto (Next.js + Supabase + Tailwind)
2. Esquema de base de datos + RLS (ver `03-backend.md`)
3. Auth (registro/login) + trigger de áreas por defecto
4. Pantalla Hoy: checklist de hábitos con los 3 tipos de control

**Día 2:**
5. Pantalla Rutina: bloques + objetivos sin horario, CRUD básico
6. Pantalla Progreso: calendario mensual + tendencia + rachas
7. Pantalla Perfil: datos básicos + tema
8. Responsive (mobile → desktop) + deploy en Vercel

## Fuera de alcance del MVP (fase 2)

- Notificaciones push / recordatorios
- Integración con Apple Health / Google Fit / wearables
- Journal o notas diarias de reflexión
- Soporte multi-idioma real (solo queda el selector como placeholder)
- Compartir progreso / funciones sociales
