import {
  IconFlame,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import type { HoyVM } from "@/lib/hoy";

export function MetricsRow({
  progreso,
  racha,
  semanal,
}: Pick<HoyVM, "progreso" | "racha" | "semanal">) {
  const pctDiario =
    progreso.total > 0
      ? Math.round((progreso.cumplidos / progreso.total) * 100)
      : 0;
  const subeSemana = semanal.delta >= 0;

  return (
    <div className="mb-5 grid grid-cols-2 gap-2.5 md:grid-cols-3">
      {/* Progreso diario — métrica hero */}
      <div className="col-span-2 rounded-[12px] border-2 border-accent bg-surface-1 p-3.5 md:col-span-1">
        <p className="mb-1 text-[11px] text-fg-secondary">Progreso diario</p>
        <p className="font-voice text-[26px] font-medium leading-none">
          {progreso.cumplidos}
          <span className="font-sans text-[14px] text-fg-muted">
            {" "}
            / {progreso.total}
          </span>
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${pctDiario}%` }}
          />
        </div>
      </div>

      {/* Racha actual */}
      <div className="rounded-[12px] border border-border bg-surface-2 p-3.5">
        <p className="mb-1 flex items-center gap-1 text-[11px] text-fg-secondary">
          <IconFlame size={12} className="text-warning" aria-hidden />
          Racha actual
        </p>
        <p className="font-voice text-[26px] font-medium leading-none">
          {racha.actual}
          <span className="font-sans text-[13px] text-fg-muted"> días</span>
        </p>
        <p className="mt-2 text-[11px] text-fg-muted">
          Mejor racha: {racha.mejor} días
        </p>
      </div>

      {/* Cumplimiento semanal */}
      <div className="rounded-[12px] border border-border bg-surface-2 p-3.5">
        <p className="mb-1 text-[11px] text-fg-secondary">Esta semana</p>
        <p className="font-voice text-[26px] font-medium leading-none">
          {semanal.pct}%
        </p>
        <p
          className={`mt-2 flex items-center gap-0.5 text-[11px] ${
            subeSemana ? "text-success" : "text-fg-muted"
          }`}
        >
          {subeSemana ? (
            <IconTrendingUp size={12} aria-hidden />
          ) : (
            <IconTrendingDown size={12} aria-hidden />
          )}
          {subeSemana ? "+" : ""}
          {semanal.delta} pts
        </p>
      </div>
    </div>
  );
}
