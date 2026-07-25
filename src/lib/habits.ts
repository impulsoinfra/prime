/**
 * Lógica de negocio de hábitos (03-backend.md → "Lógica de negocio").
 * Se resuelve en la capa app, sin funciones SQL complejas.
 */
import { addDays, getDiaSemana, isSameDay, startOfWeek, toISODate } from "./date";
import type { Habito, Registro } from "./types";

/** Umbral de "cumplido" para tipo escala (03-backend.md sugiere >= 4 de 5). */
const UMBRAL_ESCALA = 4;

/** ¿El hábito aplica hoy según su frecuencia? */
export function isProgramadoEn(h: Habito, date: Date): boolean {
  return h.frecuencia.includes(getDiaSemana(date));
}

/** Meta efectiva: 1 para booleano; `meta` para el resto. */
export function metaDe(h: Habito): number {
  if (h.tipo === "booleano") return 1;
  return h.meta ?? 1;
}

/** ¿El valor registrado cumple la meta del hábito? */
export function isCumplido(h: Habito, valor: number): boolean {
  if (h.tipo === "booleano") return valor >= 1;
  if (h.tipo === "escala") return valor >= UMBRAL_ESCALA;
  return valor >= metaDe(h);
}

/** Map habito_id → valor para una fecha concreta. */
function valoresDe(registros: Registro[], fecha: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of registros) if (r.fecha === fecha) m.set(r.habito_id, r.valor);
  return m;
}

/** Progreso del día: cumplidos / programados. */
export function progresoDiario(
  habitos: Habito[],
  registros: Registro[],
  date: Date = new Date(),
): { cumplidos: number; total: number } {
  const fecha = toISODate(date);
  const valores = valoresDe(registros, fecha);
  const programados = habitos.filter((h) => isProgramadoEn(h, date));
  const cumplidos = programados.filter((h) =>
    isCumplido(h, valores.get(h.id) ?? 0),
  ).length;
  return { cumplidos, total: programados.length };
}

/** % de cumplimiento de un día (0–1). Días sin hábitos programados devuelven null. */
export function porcentajeDia(
  habitos: Habito[],
  registros: Registro[],
  date: Date,
): number | null {
  const { cumplidos, total } = progresoDiario(habitos, registros, date);
  if (total === 0) return null;
  return cumplidos / total;
}

/** Promedio del % diario en un rango [desde, hasta] (ambos inclusive). */
export function cumplimientoRango(
  habitos: Habito[],
  registros: Registro[],
  desde: Date,
  hasta: Date,
): number {
  let suma = 0;
  let n = 0;
  let day = new Date(desde);
  while (day <= hasta) {
    const pct = porcentajeDia(habitos, registros, day);
    if (pct !== null) {
      suma += pct;
      n++;
    }
    day = addDays(day, 1);
  }
  return n === 0 ? 0 : suma / n;
}

/** Cumplimiento de la última semana (7 días) + tendencia vs. la semana previa. */
export function cumplimientoSemanal(
  habitos: Habito[],
  registros: Registro[],
  hoy: Date = new Date(),
): { pct: number; delta: number } {
  const actual = cumplimientoRango(habitos, registros, addDays(hoy, -6), hoy);
  const previa = cumplimientoRango(habitos, registros, addDays(hoy, -13), addDays(hoy, -7));
  return {
    pct: Math.round(actual * 100),
    delta: Math.round((actual - previa) * 100),
  };
}

/** Racha actual: días consecutivos al 100% hacia atrás desde hoy.
 *  Si hoy todavía no está completo, no rompe la racha (cuenta desde ayer). */
export function rachaActual(
  habitos: Habito[],
  registros: Registro[],
  hoy: Date = new Date(),
): number {
  let streak = 0;
  const hoyPct = porcentajeDia(habitos, registros, hoy);
  if (hoyPct !== null && hoyPct >= 1) streak++;

  let day = addDays(hoy, -1);
  for (let i = 0; i < 366; i++) {
    const pct = porcentajeDia(habitos, registros, day);
    if (pct === null) {
      // Día sin hábitos programados: no cuenta pero tampoco rompe la racha.
      day = addDays(day, -1);
      continue;
    }
    if (pct >= 1) {
      streak++;
      day = addDays(day, -1);
    } else {
      break;
    }
  }
  return streak;
}

/** Mejor racha histórica: recorre desde el primer registro hasta hoy. */
export function mejorRacha(
  habitos: Habito[],
  registros: Registro[],
  hoy: Date = new Date(),
): number {
  if (registros.length === 0) return 0;
  const primeraFecha = registros.reduce(
    (min, r) => (r.fecha < min ? r.fecha : min),
    registros[0].fecha,
  );
  const [y, m, d] = primeraFecha.split("-").map(Number);
  let day = new Date(y, m - 1, d);
  let best = 0;
  let run = 0;
  for (let i = 0; i < 1000 && day <= hoy; i++) {
    const pct = porcentajeDia(habitos, registros, day);
    if (pct !== null) {
      if (pct >= 1) {
        run++;
        best = Math.max(best, run);
      } else {
        run = 0;
      }
    }
    day = addDays(day, 1);
  }
  return best;
}

/** Serie semanal por área (lunes→domingo): true=cumplido, false=no, null=no programado. */
export function semanaArea(
  habitosDelArea: Habito[],
  registros: Registro[],
  hoy: Date = new Date(),
): { dias: (boolean | null)[]; cumplidos: number; total: number } {
  const lunes = startOfWeek(hoy);
  const dias: (boolean | null)[] = [];
  let cumplidos = 0;
  let total = 0;

  for (let i = 0; i < 7; i++) {
    const day = addDays(lunes, i);
    const programados = habitosDelArea.filter((h) => isProgramadoEn(h, day));
    if (programados.length === 0) {
      dias.push(null);
      continue;
    }
    total++;
    const esFuturo = day > hoy && !isSameDay(day, hoy);
    if (esFuturo) {
      dias.push(false);
      continue;
    }
    const valores = valoresDe(registros, toISODate(day));
    const met = programados.every((h) => isCumplido(h, valores.get(h.id) ?? 0));
    dias.push(met);
    if (met) cumplidos++;
  }

  return { dias, cumplidos, total };
}
