import { RutinaClient } from "@/components/rutina/RutinaClient";
import { createClient } from "@/lib/supabase/server";

export default async function RutinaPage() {
  const supabase = await createClient();

  const [areasRes, bloquesRes, habitosRes] = await Promise.all([
    supabase.from("areas").select("*").order("orden"),
    supabase.from("rutina_bloques").select("*").order("hora_inicio"),
    supabase.from("habitos").select("*").eq("activo", true).order("created_at"),
  ]);

  return (
    <RutinaClient
      areas={areasRes.data ?? []}
      bloques={bloquesRes.data ?? []}
      habitos={habitosRes.data ?? []}
    />
  );
}
