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

export type HabitoInput = {
  area_id: string;
  nombre: string;
  tipo: string;
  meta: number | null;
  unidad: string | null;
  incremento_rapido: number | null;
  frecuencia: number[];
  bloque_id: string | null;
};

function revalidar() {
  revalidatePath("/rutina");
  revalidatePath("/");
}

export async function crearHabito(input: HabitoInput): Promise<void> {
  const { supabase, userId } = await ctx();
  const { error } = await supabase
    .from("habitos")
    .insert({ user_id: userId, activo: true, ...input });
  if (error) throw new Error(error.message);
  revalidar();
}

export async function actualizarHabito(
  id: string,
  input: HabitoInput,
): Promise<void> {
  const { supabase } = await ctx();
  const { error } = await supabase.from("habitos").update(input).eq("id", id);
  if (error) throw new Error(error.message);
  revalidar();
}

export async function eliminarHabito(id: string): Promise<void> {
  const { supabase } = await ctx();
  const { error } = await supabase.from("habitos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidar();
}
