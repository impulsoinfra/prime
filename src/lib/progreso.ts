/**
 * Cálculos de la pantalla Progreso. Funciones puras sobre las filas crudas.
 * Reutiliza la lógica base de habits.ts.
 */
import { addDays, getDiaSemana, isSameDay, startOfWeek, toISODate } from "./date";
import {
  cumplimientoRango,
  isCumplido,
  isProgramadoEn,
  porcentajeDia,
} from "./habits";
import type { Habito, Registro } from "./types";

export type RangoTipo = "semana" | "mes" | "anio";

export const RANGO_LABEL: Record<RangoTipo, string> = {
  semana: "Semana",
  mes: "Mes",
  anio: "Año",
};

export function rangoFechas(
  rango: RangoTipo,
  hoy: Date,
): { desde: Date; hasta: Date } {
  const dias = rango === "semana" ? 6 : rango === "mes" ? 29 : 364;
  return { desde: addDays(hoy, -dias), hasta: hoy };
}

/** fecha "YYYY-MM-DD" de un hábito → valor registrado. */
function valorMapDe(habitoId: string, registros: Registro[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of registros) if (r.habito_id === habitoId) m.set(r.fecha, r.valor);
  return m;
}

/** Tendencia: últimas 8 semanas (lunes→domingo), % por semana. La última es la actual. */
export function tendencia8Semanas(
  habitos: Habito[],
  registros: Registro[],
  hoy: Date,
): number[] {
  const lunesEsta = startOfWeek(hoy);
  const res: number[] = [];
  for (let i = 7; i >= 0; i--) {
    const desde = addDays(lunesEsta, -7 * i);
    const finSemana = addDays(desde, 6);
    const hasta = finSemana > hoy ? hoy : finSemana;
    res.push(Math.round(cumplimientoRango(habitos, registros, desde, hasta) * 100));
  }
  return res;
}

export type CeldaCal = {
  key: string;
  dia: number;
  tipo: "adj" | "past" | "today" | "future";
  pct: number | null;
};

/** 42 celdas (6 semanas) del mes (month 0-11), grilla lunes→domingo. */
export function calendarioMes(
  habitos: Habito[],
  registros: Registro[],
  year: number,
  month: number,
  hoy: Date,
): CeldaCal[] {
  const primero = new Date(year, month, 1);
  const startWeekday = getDiaSemana(primero); // 0 = lunes
  const hoy0 = new Date(hoy);
  hoy0.setHours(0, 0, 0, 0);

  const celdas: CeldaCal[] = [];
  for (let i = 0; i < 42; i++) {
    const offset = i - startWeekday;
    const fecha = new Date(year, month, offset + 1);
    const enMes = fecha.getMonth() === month && fecha.getFullYear() === year;

    let tipo: CeldaCal["tipo"];
    let pct: number | null = null;
    if (!enMes) {
      tipo = "adj";
    } else if (isSameDay(fecha, hoy0)) {
      tipo = "today";
      pct = porcentajeDia(habitos, registros, fecha);
    } else if (fecha < hoy0) {
      tipo = "past";
      pct = porcentajeDia(habitos, registros, fecha);
    } else {
      tipo = "future";
    }
    celdas.push({ key: toISODate(fecha), dia: fecha.getDate(), tipo, pct });
  }
  return celdas;
}

/** % → uno de 4 niveles de opacidad (0.12 / 0.35 / 0.7 / 1). */
export function bucketOpacidad(pct: number): number {
  if (pct < 0.25) return 0.12;
  if (pct < 0.5) return 0.35;
  if (pct < 0.75) return 0.7;
  return 1;
}

/** % de cumplimiento de un conjunto de hábitos en un rango (instancias cumplidas / programadas). */
export function porcentajeHabitosRango(
  habitos: Habito[],
  registros: Registro[],
  desde: Date,
  hasta: Date,
): { pct: number; programadas: number } {
  const maps = new Map(habitos.map((h) => [h.id, valorMapDe(h.id, registros)]));
  let programadas = 0;
  let cumplidas = 0;
  let day = new Date(desde);
  while (day <= hasta) {
    const fecha = toISODate(day);
    for (const h of habitos) {
      if (isProgramadoEn(h, day)) {
        programadas++;
        if (isCumplido(h, maps.get(h.id)?.get(fecha) ?? 0)) cumplidas++;
      }
    }
    day = addDays(day, 1);
  }
  return { pct: programadas === 0 ? 0 : cumplidas / programadas, programadas };
}

/** Racha individual de un hábito: días programados consecutivos cumplidos hacia atrás. */
export function rachaHabito(
  h: Habito,
  registros: Registro[],
  hoy: Date,
): number {
  const map = valorMapDe(h.id, registros);
  let streak = 0;
  let day = new Date(hoy);
  day.setHours(0, 0, 0, 0);

  if (isProgramadoEn(h, day) && isCumplido(h, map.get(toISODate(day)) ?? 0)) {
    streak++;
  }
  day = addDays(day, -1);
  for (let i = 0; i < 400; i++) {
    if (!isProgramadoEn(h, day)) {
      day = addDays(day, -1);
      continue;
    }
    if (isCumplido(h, map.get(toISODate(day)) ?? 0)) {
      streak++;
      day = addDays(day, -1);
    } else {
      break;
    }
  }
  return streak;
}

export type Insight = { nombre: string; detalle: string } | null;

/** "Más constante": hábito con la racha individual más larga. */
export function insightMasConstante(
  habitos: Habito[],
  registros: Registro[],
  hoy: Date,
): Insight {
  let mejor: { h: Habito; racha: number } | null = null;
  for (const h of habitos) {
    const racha = rachaHabito(h, registros, hoy);
    if (!mejor || racha > mejor.racha) mejor = { h, racha };
  }
  if (!mejor || mejor.racha === 0) return null;
  return {
    nombre: mejor.h.nombre,
    detalle: `${mejor.racha} ${mejor.racha === 1 ? "día" : "días"} seguidos`,
  };
}

/** "Te cuesta más": hábito con el % más bajo en el rango (con al menos 1 día programado). */
export function insightTeCuestaMas(
  habitos: Habito[],
  registros: Registro[],
  desde: Date,
  hasta: Date,
): Insight {
  let peor: { h: Habito; pct: number } | null = null;
  for (const h of habitos) {
    const { pct, programadas } = porcentajeHabitosRango([h], registros, desde, hasta);
    if (programadas < 1) continue;
    if (!peor || pct < peor.pct) peor = { h, pct };
  }
  if (!peor) return null;
  return { nombre: peor.h.nombre, detalle: `${Math.round(peor.pct * 100)}% cumplido` };
}
