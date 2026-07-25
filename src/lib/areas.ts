import {
  IconBarbell,
  IconBrain,
  IconBriefcase,
  IconHeart,
  type Icon,
} from "@tabler/icons-react";
import type { Area, AreaSlug } from "./types";

/** Orden fijado por el trigger de onboarding (03-backend.md → handle_new_user). */
const SLUG_BY_ORDEN: AreaSlug[] = ["fisico", "mental", "personal", "laboral"];

const SLUG_BY_NOMBRE: Record<string, AreaSlug> = {
  fisico: "fisico",
  mental: "mental",
  personal: "personal",
  laboral: "laboral",
};

// Rango de marcas diacríticas combinantes (U+0300–U+036F). Se construye con
// escapes explícitos para que no dependa de caracteres invisibles en el fuente.
const DIACRITICOS = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(DIACRITICOS, "");
}

/** Deriva el slug de área (color/ícono) por nombre y, si no matchea, por orden. */
export function areaSlug(area: Pick<Area, "orden" | "nombre">): AreaSlug {
  return SLUG_BY_NOMBRE[normalize(area.nombre)] ?? SLUG_BY_ORDEN[area.orden] ?? "fisico";
}

/** Clase CSS que setea --c-bg/--c-fg/--c-line del área (definidas en globals.css). */
export function areaClass(area: Pick<Area, "orden" | "nombre">): string {
  return `area-${areaSlug(area)}`;
}

export const AREA_ICONS: Record<AreaSlug, Icon> = {
  fisico: IconBarbell,
  mental: IconBrain,
  personal: IconHeart,
  laboral: IconBriefcase,
};

export const AREA_LABEL: Record<AreaSlug, string> = {
  fisico: "Físico",
  mental: "Mental",
  personal: "Personal",
  laboral: "Laboral",
};
