"use server";

import { revalidatePath } from "next/cache";
import { toISODate } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

async function currentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  return { supabase, userId: user.id };
}

/** Setea el valor absoluto del registro de hoy (booleano, duración final, etc.). */
export async function setValor(habitoId: string, valor: number): Promise<void> {
  const { supabase, userId } = await currentUserId();
  const fecha = toISODate();

  const { error } = await supabase
    .from("registros")
    .upsert(
      { user_id: userId, habito_id: habitoId, fecha, valor },
      { onConflict: "habito_id,fecha" },
    );
  if (error) throw new Error(error.message);

  revalidatePath("/");
}

/** Suma un incremento al valor de hoy (botón "+" de registro rápido). */
export async function incrementarValor(
  habitoId: string,
  incremento: number,
): Promise<void> {
  const { supabase, userId } = await currentUserId();
  const fecha = toISODate();

  const { data: existente } = await supabase
    .from("registros")
    .select("valor")
    .eq("habito_id", habitoId)
    .eq("fecha", fecha)
    .maybeSingle();

  const nuevo = (existente?.valor ?? 0) + incremento;

  const { error } = await supabase
    .from("registros")
    .upsert(
      { user_id: userId, habito_id: habitoId, fecha, valor: nuevo },
      { onConflict: "habito_id,fecha" },
    );
  if (error) throw new Error(error.message);

  revalidatePath("/");
}
