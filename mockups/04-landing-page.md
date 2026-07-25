# Landing page — Prime

## Objetivo

Página de marketing pre-lanzamiento. Su único trabajo es comunicar la propuesta de valor de Prime y capturar interés (email) antes de que el producto esté disponible. No requiere autenticación ni conexión al resto de la app funcional.

## Relación con el resto del proyecto

**La landing tiene su propia identidad visual, separada del sistema de `02-diseno-ui.md`.** Ese documento define la UI del producto en uso diario (funcional, clara, con soporte real de claro/oscuro). La landing es una pieza de marketing: un solo tema oscuro fijo, tipografía más expresiva, más animación. No hay que reconciliar ambos sistemas — comparten los 4 colores de área (continuidad de marca) pero todo lo demás es intencionalmente distinto.

La landing sí introduce el **isotipo oficial de Prime** (el pico), que es nuevo respecto a las specs anteriores y debería adoptarse también como ícono de la app (favicon, PWA icon, y potencialmente el logo del sidebar en `01-proyecto.md`).

## Sistema visual de la landing

### Paleta (fija, sin modo claro)

| Variable | Hex | Uso |
|---|---|---|
| `--ink` | `#14120F` | fondo base |
| `--ink-2` | `#1C1913` | fondo de tarjetas/hover |
| `--ink-3` | `#26221A` | fondo de barras de progreso, elementos anidados |
| `--paper` | `#F2EDE4` | texto principal, fondo de la sección de cita |
| `--paper-2` | `#E7DFD0` | fondo secundario sobre paper |
| `--mist` | `#948E80` | texto secundario |
| `--mist-dim` | `#5C5848` | texto terciario / mono labels |
| `--coral` | `#D85A30` | acento — físico, cima del ícono |
| `--violet` | `#7F77DD` | acento — mental |
| `--teal` | `#1D9E75` | acento — personal |
| `--amber` | `#BA7517` | acento — laboral |
| `--line` | `rgba(242,237,228,0.12)` | bordes sutiles sobre fondo oscuro |
| `--line-strong` | `rgba(242,237,228,0.22)` | bordes con más presencia |

### Tipografía

Tres roles, no dos — es la decisión de diseño central de toda la marca:

- **Fraunces** (serif) — títulos, wordmark, cita grande. Peso 500, itálica solo para énfasis puntual (la palabra "prime" en el H1).
- **Inter** (sans) — cuerpo de texto, navegación, botones.
- **JetBrains Mono** — eyebrows, labels, stats, footer. Le da el tono "preciso/de datos" que diferencia a Prime de un genérico landing de wellness.

Escala: H1 `clamp(48px, 8vw, 92px)`, H2 de sección `clamp(32px, 4.5vw, 48px)`, cuerpo 16-18px.

### Logo / marca

- **Ícono**: triángulo sólido (el "pico") con un punto de color en la cima. Representa el auge / punto máximo de una persona — el significado literal de "prime".
- El punto de la cima solo se muestra a partir de ~64px; en tamaños chicos (favicon 16–24px) se usa la variante sin punto para no perder legibilidad.
- **Wordmark**: "prime" en Fraunces 500, minúscula, sin itálica.
- **Lockup**: ícono a 32px + 8px de gap + wordmark con `line-height: 1` (crítico — sin esto el alineado vertical se rompe).
- Archivos fuente: `prime-mark.svg` (con punto), `prime-mark-small.svg` (sin punto, para favicon), `logo-showcase.html` (todas las variantes y pruebas de tamaño/contraste).

## Estructura de secciones

### 1. Nav
Sticky, fondo transparente que gana blur + borde al scrollear (`.scrolled`). Logo a la izquierda, links a la derecha ("Producto", "Cómo funciona"), botón "Empezar".

### 2. Hero
- Eyebrow: `prime · adj. · en tu punto más alto` (tratamiento tipo definición de diccionario)
- H1: "Encontrá tu **prime**." — la palabra "prime" en itálica con animación de color que recorre los 4 tonos de área en loop (8s)
- Subhead: "La app que organiza tu rutina diaria y mide tu progreso real — físico, mental, personal y laboral — en un solo lugar."
- CTAs: "Empezar gratis" (botón primario, sólido) + "Ver cómo funciona →" (secundario, outline, ancla a `#como-funciona`)
- Fondo: 3 blobs de color (coral/violeta/teal) con blur y drift lento, opacidad baja (0.22)
- **Elemento firma**: secuencia de números del 1 al 30 en mono; los números primos (2,3,5,7,11,13,17,19,23,29) se iluminan en secuencia con un pulso escalonado cuando la sección entra en viewport. Caption debajo: "no todos los días pesan igual. los que construyen, cuentan."
- Franja de 3 stats (no son métricas infladas de usuarios — son hechos del producto): `4` áreas de vida · `3` tipos de meta · `1` rutina, todos los días

### 3. Producto (`#producto`) — features
Eyebrow: "cuatro áreas, un solo sistema". H2: "Tu vida no está dividida en pestañas."
Grilla de 4 tarjetas (Físico / Mental / Personal / Laboral), cada una con: inicial tipográfica en Fraunces itálica como ícono (no pictograma), color de área, título, descripción corta. Hover: leve elevación + cambio de fondo.

### 4. Cómo funciona (`#como-funciona`) — showcase
Eyebrow: "tu día, de un vistazo". H2: "Mirá tu día, no una lista."
Frame tipo ventana de navegador conteniendo un preview fiel de la pantalla "Hoy" del producto real (mismo layout y datos de ejemplo que en `01-proyecto.md`): saludo, racha, tarjeta "Ahora" con barra de progreso, grilla de 4 áreas.

### 5. Cita
Única sección con fondo claro (`--paper`), para generar una pausa visual. Cita grande en Fraunces itálica: *"La disciplina de hoy es la libertad de mañana."* Atribución: "editable desde tu perfil. la app se adapta a tus palabras, no al revés." — recuerda que la frase es una feature real del producto (pantalla Perfil), no una frase inventada para marketing.

### 6. Tres pasos
H2: "Empezar te toma diez minutos." Lista numerada (justificado — acá sí hay una secuencia real):
1. Definí tus áreas y tus metas
2. Armá tu rutina semanal
3. Trackeá tu progreso, día a día

### 7. CTA final
H2: "Tu prime empieza el día que decidís medirlo." Input de email + botón "Unirme".

### 8. Footer
Logo, links, y el tag `f′(vos) · © 2026` — notación de derivada ("f prima"), el mismo guiño matemático que el ícono. Detalle silencioso, no se explica en ningún lado de la página.

## Animaciones

| Elemento | Comportamiento |
|---|---|
| Reveal al scroll | Todas las secciones con clase `.reveal`: `opacity 0→1` + `translateY 28px→0`, 0.8s, easing `cubic-bezier(0.16,1,0.3,1)`. Delays escalonados (`.reveal-delay-1..4`) para grupos de elementos. |
| Blobs del hero | `translate + scale` lento, 22s, `ease-in-out infinite alternate`, delays distintos por blob para que no se muevan en sincro. |
| Palabra "prime" | Gradient de 4 colores animado vía `background-position`, 8s linear infinite. |
| Secuencia de primos | Al entrar en viewport (una sola vez), cada celda prima hace un pulso de escala con 140ms de stagger entre una y la siguiente. |
| Nav | Transición de `border-color` y `background` al pasar `scrollY > 20`. |

**Accesibilidad**: todo lo anterior respeta `prefers-reduced-motion: reduce` — se desactivan las transiciones/animaciones y `scroll-behavior` vuelve a `auto`.

## Responsive

- `900px` — grilla de features pasa de 4 a 2 columnas
- `720px` — se ocultan los links de nav (queda solo logo + CTA)
- `640px` — stats strip, mono-row y stage-row pasan a una columna
- `560px` — grilla de features pasa a 1 columna

## Notas de implementación para Next.js

La landing hoy es un HTML estático (`landing.html`) para poder iterar rápido el diseño. Para integrarla al proyecto real:

1. **Ruta**: vive en un route group separado del producto autenticado, por ejemplo `app/(marketing)/page.tsx`, con su propio `layout.tsx` sin sidebar ni bottom nav.
2. **Fuentes**: reemplazar el `<link>` de Google Fonts por `next/font/google` (`Fraunces`, `Inter`, `JetBrains_Mono`) para evitar layout shift y servir los fonts optimizados.
3. **Estilos**: el `<style>` inline pasa a un CSS module (`landing.module.css`) o a variables de Tailwind config — mantener los nombres de variables tal cual (`--ink`, `--coral`, etc.) para no reescribir la lógica de color.
4. **Scroll reveal**: convertir el `IntersectionObserver` vanilla a un hook (`useInView`) aplicado por sección — hay librerías (`react-intersection-observer`) o se puede escribir el hook a mano, es simple.
5. **Secuencia de primos**: el cálculo de `isPrime()` y el render de celdas se puede mover a un componente `<PrimeSequence />` que genera el array una sola vez con `useMemo`.
6. **Captura de email**: el input actual es solo visual. Conectar a una tabla `waitlist` en Supabase (`id`, `email`, `created_at`) vía server action, o a un servicio externo si se prefiere no mezclarlo con la base de datos del producto.
7. **Referencia**: usar `landing.html` como fuente de verdad 1:1 para el maquetado — todo el copy y las clases CSS de este documento están tomados directamente de ese archivo.
