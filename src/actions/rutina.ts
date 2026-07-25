"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function ctx() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  return { supabase, userId: user.id };
}

export type BloqueInput = {
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string | null;
  titulo: string;
  descripcion: string | null;
  area_id: string | null;
};

function revalidar() {
  revalidatePath("/app/rutina");
  revalidatePath("/app");
}

export async function crearBloque(input: BloqueInput): Promise<void> {
  const { supabase, userId } = await ctx();
  const { error } = await supabase
    .from("rutina_bloques")
    .insert({ user_id: userId, ...input });
  if (error) throw new Error(error.message);
  revalidar();
}

export async function actualizarBloque(
  id: string,
  input: BloqueInput,
): Promise<void> {
  const { supabase } = await ctx();
  const { error } = await supabase
    .from("rutina_bloques")
    .update(input)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidar();
}

export async function eliminarBloque(id: string): Promise<void> {
  const { supabase } = await ctx();
  const { error } = await supabase.from("rutina_bloques").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidar();
}

/** Copia los bloques del día origen a lunes–viernes, reemplazando lo que hubiera. */
export async function copiarDiaALaboral(diaOrigen: number): Promise<void> {
  const { supabase, userId } = await ctx();

  const { data: origen, error: e1 } = await supabase
    .from("rutina_bloques")
    .select("*")
    .eq("dia_semana", diaOrigen);
  if (e1) throw new Error(e1.message);

  const destino = [0, 1, 2, 3, 4].filter((d) => d !== diaOrigen);

  const { error: e2 } = await supabase
    .from("rutina_bloques")
    .delete()
    .in("dia_semana", destino);
  if (e2) throw new Error(e2.message);

  const copias = (origen ?? []).flatMap((b) =>
    destino.map((d) => ({
      user_id: userId,
      dia_semana: d,
      hora_inicio: b.hora_inicio,
      hora_fin: b.hora_fin,
      titulo: b.titulo,
      descripcion: b.descripcion,
      area_id: b.area_id,
    })),
  );

  if (copias.length > 0) {
    const { error: e3 } = await supabase.from("rutina_bloques").insert(copias);
    if (e3) throw new Error(e3.message);
  }

  revalidar();
}
