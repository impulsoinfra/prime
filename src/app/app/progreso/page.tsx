import { ProgresoClient } from "@/components/progreso/ProgresoClient";
import { addDays, toISODate } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

export default async function ProgresoPage() {
  const supabase = await createClient();
  // Ventana amplia para soportar rango "Año", tendencia de 8 semanas y calendario.
  const desde = toISODate(addDays(new Date(), -400));

  const [areasRes, habitosRes, registrosRes] = await Promise.all([
    supabase.from("areas").select("*").order("orden"),
    supabase.from("habitos").select("*").eq("activo", true).order("created_at"),
    supabase.from("registros").select("*").gte("fecha", desde),
  ]);

  return (
    <ProgresoClient
      areas={areasRes.data ?? []}
      habitos={habitosRes.data ?? []}
      registros={registrosRes.data ?? []}
    />
  );
}
