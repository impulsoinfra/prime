/**
 * ViewModel de la pantalla "Hoy": toma las filas crudas de Supabase y produce
 * todo lo que los componentes necesitan (métricas, bloques, progreso por área,
 * checklist), aplicando la lógica de negocio de habits.ts.
 */
import { AREA_LABEL, areaSlug } from "./areas";
import { nowMinutes, toISODate } from "./date";
import {
  cumplimientoSemanal,
  isCumplido,
  isProgramadoEn,
  mejorRacha,
  metaDe,
  progresoDiario,
  rachaActual,
  semanaArea,
} from "./habits";
import type { Area, AreaSlug, Habito, Registro, RutinaBloque } from "./types";

export type BloqueVM = {
  id: string;
  titulo: string;
  descripcion: string | null;
  horaInicio: string;
  horaFin: string | null;
  areaSlug: AreaSlug | null;
  areaLabel: string | null;
};

export type HabitoVM = {
  id: string;
  nombre: string;
  tipo: string;
  meta: number;
  unidad: string | null;
  incrementoRapido: number | null;
  areaSlug: AreaSlug;
  valor: number;
  cumplido: boolean;
};

export type AreaProgresoVM = {
  slug: AreaSlug;
  label: string;
  dias: (boolean | null)[];
  cumplidos: number;
  total: number;
};

export type HoyVM = {
  progreso: { cumplidos: number; total: number };
  racha: { actual: number; mejor: number };
  semanal: { pct: number; delta: number };
  bloques: BloqueVM[];
  serverNowMin: number;
  areas: AreaProgresoVM[];
  habitos: HabitoVM[];
};

export function buildHoy(input: {
  areas: Area[];
  habitos: Habito[];
  registros: Registro[];
  bloques: RutinaBloque[];
  hoy?: Date;
}): HoyVM {
  const { areas, habitos, registros, bloques } = input;
  const hoy = input.hoy ?? new Date();
  const fechaHoy = toISODate(hoy);

  const valoresHoy = new Map<string, number>();
  for (const r of registros) {
    if (r.fecha === fechaHoy) valoresHoy.set(r.habito_id, r.valor);
  }

  const areaById = new Map(areas.map((a) => [a.id, a]));

  const bloquesVM: BloqueVM[] = bloques.map((b) => {
    const area = b.area_id ? areaById.get(b.area_id) : undefined;
    const slug = area ? areaSlug(area) : null;
    return {
      id: b.id,
      titulo: b.titulo,
      descripcion: b.descripcion,
      horaInicio: b.hora_inicio,
      horaFin: b.hora_fin,
      areaSlug: slug,
      areaLabel: slug ? AREA_LABEL[slug] : null,
    };
  });

  const areasVM: AreaProgresoVM[] = areas.map((a) => {
    const slug = areaSlug(a);
    const habitosArea = habitos.filter((h) => h.area_id === a.id);
    const { dias, cumplidos, total } = semanaArea(habitosArea, registros, hoy);
    return { slug, label: AREA_LABEL[slug], dias, cumplidos, total };
  });

  const habitosVM: HabitoVM[] = habitos
    .filter((h) => isProgramadoEn(h, hoy))
    .map((h) => {
      const area = areaById.get(h.area_id);
      const slug = area ? areaSlug(area) : "fisico";
      const valor = valoresHoy.get(h.id) ?? 0;
      return {
        id: h.id,
        nombre: h.nombre,
        tipo: h.tipo,
        meta: metaDe(h),
        unidad: h.unidad,
        incrementoRapido: h.incremento_rapido,
        areaSlug: slug,
        valor,
        cumplido: isCumplido(h, valor),
      };
    });

  return {
    progreso: progresoDiario(habitos, registros, hoy),
    racha: {
      actual: rachaActual(habitos, registros, hoy),
      mejor: mejorRacha(habitos, registros, hoy),
    },
    semanal: cumplimientoSemanal(habitos, registros, hoy),
    bloques: bloquesVM,
    serverNowMin: nowMinutes(hoy),
    areas: areasVM,
    habitos: habitosVM,
  };
}
