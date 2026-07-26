import { AhoraCard } from "@/components/hoy/AhoraCard";
import { AreaProgressGrid } from "@/components/hoy/AreaProgressGrid";
import { DayTimeline } from "@/components/hoy/DayTimeline";
import { Greeting } from "@/components/hoy/Greeting";
import { HabitChecklist } from "@/components/hoy/HabitChecklist";
import { MetricsRow } from "@/components/hoy/MetricsRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { addDays, getDiaSemana, toISODate } from "@/lib/date";
import { buildHoy } from "@/lib/hoy";
import { createClient } from "@/lib/supabase/server";

export default async function HoyPage() {
  const supabase = await createClient();
  const hoy = new Date();
  const dia = getDiaSemana(hoy);
  const desde = toISODate(addDays(hoy, -40)); // ventana para métricas/rachas

  const [userRes, areasRes, habitosRes, registrosRes, bloquesRes] =
    await Promise.all([
      supabase.auth.getUser(),
      supabase.from("areas").select("*").order("orden"),
      supabase.from("habitos").select("*").eq("activo", true).order("created_at"),
      supabase.from("registros").select("*").gte("fecha", desde),
      supabase
        .from("rutina_bloques")
        .select("*")
        .eq("dia_semana", dia)
        .order("hora_inicio"),
    ]);

  const nombre =
    (userRes.data.user?.user_metadata?.nombre as string | undefined) ?? "";

  const vm = buildHoy({
    areas: areasRes.data ?? [],
    habitos: habitosRes.data ?? [],
    registros: registrosRes.data ?? [],
    bloques: bloquesRes.data ?? [],
    hoy,
  });

  return (
    <>
      <Greeting nombre={nombre} />
      <MetricsRow
        progreso={vm.progreso}
        racha={vm.racha}
        semanal={vm.semanal}
      />

      <div className="mb-5 flex flex-col gap-5 lg:grid lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-4">
            <AhoraCard bloques={vm.bloques} serverNowMin={vm.serverNowMin} />
          </div>
          <SectionTitle>Tu día</SectionTitle>
          <DayTimeline bloques={vm.bloques} nowMin={vm.serverNowMin} />
        </div>
        <div>
          <AreaProgressGrid areas={vm.areas} />
        </div>
      </div>

      <SectionTitle>Objetivos de hoy</SectionTitle>
      <HabitChecklist habitos={vm.habitos} />
    </>
  );
}
