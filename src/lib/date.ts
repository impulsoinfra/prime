/**
 * Helpers de fecha. Clave: el esquema usa `dia_semana` 0=lunes … 6=domingo,
 * distinto de `Date.getDay()` (0=domingo). Todo el código pasa por getDiaSemana.
 */

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
export const DIAS_CORTOS = ["L", "M", "M", "J", "V", "S", "D"];
const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** 0=lunes … 6=domingo (convención del esquema). */
export function getDiaSemana(date: Date = new Date()): number {
  return (date.getDay() + 6) % 7;
}

/** "Viernes 24 de julio" */
export function formatFechaLarga(date: Date = new Date()): string {
  return `${DIAS[getDiaSemana(date)]} ${date.getDate()} de ${MESES[date.getMonth()]}`;
}

/** "Julio 2026" */
export function mesAnioLabel(year: number, month: number): string {
  const m = MESES[month];
  return `${m.charAt(0).toUpperCase()}${m.slice(1)} ${year}`;
}

/** Saludo según la hora del día. */
export function saludo(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Hola, buenos días";
  if (h < 20) return "Hola, buenas tardes";
  return "Hola, buenas noches";
}

/** Fecha local en formato YYYY-MM-DD (para registros.fecha). No usa UTC. */
export function toISODate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parsea "YYYY-MM-DD" a Date local (evita el desfase de zona de new Date(str)). */
export function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "9:00" a partir de "09:00:00" (columna time de Postgres). */
export function formatHora(time: string): string {
  const [h, m] = time.split(":");
  return `${parseInt(h, 10)}:${m}`;
}

/** Minutos desde medianoche para un "HH:MM[:SS]". */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Minutos desde medianoche de una fecha. */
export function nowMinutes(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Minutos desde medianoche → "9:05". */
export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/** Lunes 00:00 de la semana de `date`. */
export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - getDiaSemana(d));
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
