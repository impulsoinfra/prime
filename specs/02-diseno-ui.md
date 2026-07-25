# Sistema de diseño — Prime

## Filosofía

El objetivo es que la app se sienta editorial y personal, no como un dashboard SaaS genérico. Dos decisiones sostienen esto en toda la app:

1. **Tipografía mixta**: una serif con carácter reservada exclusivamente para números grandes y el nombre de marca; el resto de la interfaz en sans-serif neutra. Esto rompe con el patrón "todo sans-serif" de casi cualquier app de hábitos.
2. **Identidad por color, no por estado**: cada área de vida (Físico, Mental, Personal, Laboral) tiene un color fijo que se repite consistentemente en toda la app (tarjetas, puntos en listas, barras de rutina, bloques de horario). Un vistazo al color alcanza para saber de qué área se trata, sin leer texto.

## Tipografía

- **Sans (UI, cuerpo, labels)**: Inter (o system-ui como fallback). Pesos usados: 400 (regular) y 500 (medium) — evitar 600/700 salvo para números destacados.
- **Serif (marca + números hero)**: Fraunces o Source Serif 4 (Google Fonts). Uso exclusivo para: el nombre "prime" en el sidebar/logo, y los números grandes de las tarjetas de estadísticas (ej. "78%", "12 días", "5/8"). Nunca usar la serif en párrafos ni labels.

Escala tipográfica sugerida:
| Uso | Tamaño | Peso | Fuente |
|---|---|---|---|
| Número hero (stat destacado) | 26–52px | 500 | Serif |
| Título de pantalla | 18px | 500 | Sans |
| Título de tarjeta/sección | 13–15px | 500 | Sans |
| Cuerpo / labels | 12–13px | 400 | Sans |
| Texto auxiliar / metadata | 10–11px | 400 | Sans |

## Color

Todos los colores se definen como variables CSS (`:root` para claro, `.dark` o `@media (prefers-color-scheme: dark)` para oscuro) para que ningún componente hardcodee un valor.

### Paleta neutra (superficies, texto, bordes)

| Variable | Claro | Oscuro |
|---|---|---|
| `--surface-1` (fondo de página) | `#FFFFFF` | `#131211` |
| `--surface-2` (tarjetas, fondos secundarios) | `#F4F3F0` | `#1E1D1A` |
| `--text-primary` | `#1C1B1A` | `#F2F1EE` |
| `--text-secondary` | `#57544E` | `#B8B5AE` |
| `--text-muted` | `#8A867E` | `#7C7972` |
| `--border` | `#E8E6E1` | `#2C2B28` |
| `--border-strong` | `#D3D0C9` | `#3D3B37` |

### Color de acento (acciones primarias, selección, calendario)

| Variable | Claro | Oscuro |
|---|---|---|
| `--accent` | `#3B5BDB` | `#7C93F5` |
| `--accent-fg` (texto sobre acento) | `#FFFFFF` | `#0E1330` |
| `--accent-bg` (fondo tenue) | `#E9EDFB` | `#1B2440` |

### Semánticos

| Variable | Claro | Oscuro |
|---|---|---|
| `--success` | `#16A34A` | `#4ADE80` |
| `--warning` | `#D97706` | `#FBBF24` |
| `--danger` | `#DC2626` | `#F87171` |

### Colores de área (fijos, no cambian con el modo — solo su intensidad)

Estos son los colores de identidad de cada área de vida. Se usan como acento de fondo tenue (`bg`), color de texto/ícono sobre ese fondo (`fg`), y color de línea/relleno para barras y puntos (`line`).

**Físico** (coral)
| | Claro | Oscuro |
|---|---|---|
| bg | `#FAECE7` | `#712B13` |
| fg | `#4A1B0C` | `#F5C4B3` |
| line | `#D85A30` | `#F0997B` |

**Mental** (violeta)
| | Claro | Oscuro |
|---|---|---|
| bg | `#EEEDFE` | `#3C3489` |
| fg | `#26215C` | `#CECBF6` |
| line | `#7F77DD` | `#AFA9EC` |

**Personal** (verde azulado)
| | Claro | Oscuro |
|---|---|---|
| bg | `#E1F5EE` | `#085041` |
| fg | `#04342C` | `#9FE1CB` |
| line | `#1D9E75` | `#5DCAA5` |

**Laboral** (ámbar)
| | Claro | Oscuro |
|---|---|---|
| bg | `#FAEEDA` | `#633806` |
| fg | `#412402` | `#FAC775` |
| line | `#BA7517` | `#EF9F27` |

> Nota de implementación: el color de un área es configurable por el usuario a futuro, pero estos 4 son los valores por defecto y los que aparecen en todos los mockups de referencia.

## Iconografía

**Tabler Icons** (`@tabler/icons-react`), estilo outline, stroke uniforme. Mapeo de íconos usado en los mockups:

- Físico → `IconBarbell`
- Mental → `IconBrain`
- Personal → `IconHeart`
- Laboral → `IconBriefcase`
- Racha → `IconFlame`
- Mejor racha → `IconTrophy`
- Promedio/tendencia → `IconChartLine`
- Navegación: `IconHome` (Hoy), `IconChartBar` (Progreso), `IconCalendar` (Rutina), `IconUser` (Perfil)
- Acciones: `IconPlus`, `IconPencil`, `IconChevronRight` / `IconChevronDown`, `IconCheck`, `IconPlayerPlay`, `IconLink` (bloque vinculado a hábito)

## Radios y espaciado

- Radio base (inputs, botones, tarjetas pequeñas): **10–12px**
- Radio de contenedores grandes / hojas modales: **20–24px**, o **24px 24px 0 0** para modales tipo bottom sheet
- Elementos circulares (avatares, checkboxes, toggles, badges de día): `border-radius: 50%` / pill completo
- Escala de espaciado: 4 · 8 · 12 · 16 · 20 · 24px

## Componentes clave

### Barra segmentada de 7 días (progreso semanal por área)
7 segmentos rectangulares redondeados en fila. Relleno = color `line` del área. Días no cumplidos al 25% de opacidad del mismo color. No usar anillos circulares de progreso — un vistazo a los segmentos indica *qué* días se cumplió, no solo el porcentaje.

### Calendario mensual (pantalla Progreso)
Grilla de 7 columnas (L a D) x hasta 6 filas. Cada celda de día:
- **Pasado**: fondo `--accent` con opacidad según intensidad (4 niveles: 0.12 / 0.35 / 0.7 / 1) mapeada al % de cumplimiento de ese día. Texto blanco si opacidad ≥ 0.55, texto `--text-secondary` si es menor.
- **Hoy**: mismo tratamiento + anillo (`box-shadow` o `border`) con `--accent`.
- **Futuro**: sin relleno, borde punteado `--border`, texto `--text-muted`.
- **Días de mes adyacente** (para completar la grilla): opacidad 0.35, sin interacción.

### Tarjeta "Ahora" (Hoy)
Fondo `--surface-2`, barra vertical de color de categoría a la izquierda, título + subtítulo (categoría · horario · tiempo restante), barra de progreso horizontal del bloque en curso, divisor + "a continuación" con el próximo bloque.

### Controles de hábito (checklist)
- `booleano`: círculo 20px, relleno `--success` + check blanco cuando está hecho; borde `--border-strong` sin relleno cuando no.
- `numerico`/`duracion` en progreso: barra de progreso delgada (5px) bajo el texto "actual / meta unidad", botón circular "+" a la derecha para el incremento rápido.
- `duracion` sin iniciar: botón circular relleno `--accent` con ícono de play.

### Toggle (switch)
Track 34x20px, `border-radius: 10px`. Apagado: fondo `--border-strong`, círculo a la izquierda. Encendido: fondo `--accent`, círculo a la derecha, color del círculo `--accent-fg`.

### Navegación
- **Mobile**: barra inferior, 4 íconos + label 11px, ítem activo en `--accent`, resto en `--text-muted`.
- **Desktop**: sidebar de ~220–240px, logo "prime" en serif arriba, lista de ítems de nav con ícono + label (ítem activo con fondo `--accent-bg` y texto `--accent`), chip de usuario (avatar + nombre) anclado abajo.

## Dark mode

Toda la interfaz debe funcionar en ambos modos sin ajustes manuales por componente:
- Ningún color se hardcodea; todo pasa por las variables CSS de la tabla anterior.
- El modo se controla por `prefers-color-scheme` del sistema por defecto, con override manual guardado en preferencias del usuario (pantalla Perfil → Tema: Claro / Oscuro / Sistema).
- Los colores de área mantienen su identidad cromática en ambos modos (mismo hue), solo cambia la luminosidad/saturación para mantener contraste AA sobre el fondo correspondiente.

## Accesibilidad

- Contraste mínimo AA (4.5:1) para texto sobre cualquier fondo, incluyendo texto sobre las tarjetas de área con color.
- Targets táctiles mínimos de 40x40px en mobile (checkboxes, botones de +, ítems de nav).
- Toda la información transmitida por color (áreas, calendario) debe tener un respaldo textual (nombre del área, número de día, tooltip/label), nunca color como único indicador.
