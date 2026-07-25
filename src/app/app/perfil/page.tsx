import { PerfilClient } from "@/components/perfil/PerfilClient";
import { mejorRacha, rachaActual } from "@/lib/habits";
import { createClient } from "@/lib/supabase/server";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [perfilRes, habitosRes, registrosRes] = await Promise.all([
    supabase.from("perfiles").select("*").maybeSingle(),
    supabase.from("habitos").select("*").eq("activo", true),
    supabase.from("registros").select("*"),
  ]);

  const habitos = habitosRes.data ?? [];
  const registros = registrosRes.data ?? [];
  const hoy = new Date();

  const diasActivos = new Set(registros.map((r) => r.fecha)).size;

  const nombreMap = new Map(habitos.map((h) => [h.id, h.nombre]));
  const exportRows = registros
    .map((r) => ({
      fecha: r.fecha,
      habito: nombreMap.get(r.habito_id) ?? r.habito_id,
      valor: r.valor,
      nota: r.nota,
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return (
    <PerfilClient
      nombre={(user?.user_metadata?.nombre as string | undefined) ?? ""}
      email={user?.email ?? ""}
      prioridades={perfilRes.data?.prioridades ?? []}
      frase={perfilRes.data?.frase ?? null}
      tema={perfilRes.data?.tema ?? "sistema"}
      stats={{
        rachaAct: rachaActual(habitos, registros, hoy),
        mejor: mejorRacha(habitos, registros, hoy),
        diasActivos,
      }}
      exportRows={exportRows}
    />
  );
}
