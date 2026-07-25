import type { Database } from "./database.types";

export type Area = Database["public"]["Tables"]["areas"]["Row"];
export type RutinaBloque = Database["public"]["Tables"]["rutina_bloques"]["Row"];
export type Habito = Database["public"]["Tables"]["habitos"]["Row"];
export type Registro = Database["public"]["Tables"]["registros"]["Row"];
export type Perfil = Database["public"]["Tables"]["perfiles"]["Row"];

/** Tipos de meta de un hábito (03-backend.md → habitos.tipo). */
export type TipoHabito = "booleano" | "numerico" | "duracion" | "escala";

/** Áreas de vida por defecto. El color se deriva de este slug (lib/areas.ts). */
export type AreaSlug = "fisico" | "mental" | "personal" | "laboral";
