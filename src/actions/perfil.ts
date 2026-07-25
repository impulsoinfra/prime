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

export async function actualizarPerfil(patch: {
  prioridades?: string[];
  frase?: string | null;
  tema?: string;
}): Promise<void> {
  const { supabase, userId } = await ctx();
  const { error } = await supabase
    .from("perfiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/app/perfil");
}

export async function actualizarNombre(nombre: string): Promise<void> {
  const { supabase } = await ctx();
  const { error } = await supabase.auth.updateUser({ data: { nombre } });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function cambiarPassword(nueva: string): Promise<void> {
  const { supabase } = await ctx();
  const { error } = await supabase.auth.updateUser({ password: nueva });
  if (error) throw new Error(error.message);
}
