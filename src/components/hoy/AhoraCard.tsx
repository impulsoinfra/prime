"use client";

import { IconClock, IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { formatHora, minutesToLabel, nowMinutes, timeToMinutes } from "@/lib/date";
import type { BloqueVM } from "@/lib/hoy";

export function AhoraCard({
  bloques,
  serverNowMin,
}: {
  bloques: BloqueVM[];
  serverNowMin: number;
}) {
  // Se inicializa con la hora del servidor (evita mismatch de hidratación) y
  // luego pasa a la hora real del cliente, actualizándose cada 30s.
  const [nowMin, setNowMin] = useState(serverNowMin);
  useEffect(() => {
    const tick = () => setNowMin(nowMinutes());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const activo = bloques.find(
    (b) =>
      b.horaFin != null &&
      timeToMinutes(b.horaInicio) <= nowMin &&
      nowMin < timeToMinutes(b.horaFin),
  );

  const proximo = bloques
    .filter((b) => timeToMinutes(b.horaInicio) > nowMin)
    .sort((a, b) => timeToMinutes(a.horaInicio) - timeToMinutes(b.horaInicio))[0];

  return (
    <div className="rounded-[16px] border border-border bg-surface-2 p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] text-fg-secondary">
          <IconClock size={14} className="text-fg-muted" aria-hidden />
          Ahora · {minutesToLabel(nowMin)}
        </span>
        <IconPencil size={15} className="text-fg-muted" aria-hidden />
      </div>

      {activo ? (
        <ActivoView bloque={activo} nowMin={nowMin} />
      ) : (
        <p className="py-2 text-[13px] text-fg-muted">
          Sin bloque programado ahora
        </p>
      )}

      <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-[12px] text-fg-muted">A continuación</span>
        <span className="text-[13px]">
          {proximo
            ? `${formatHora(proximo.horaInicio)} · ${proximo.titulo}`
            : "—"}
        </span>
      </div>
    </div>
  );
}

function ActivoView({
  bloque,
  nowMin,
}: {
  bloque: BloqueVM;
  nowMin: number;
}) {
  const start = timeToMinutes(bloque.horaInicio);
  const end = timeToMinutes(bloque.horaFin!);
  const restante = Math.max(0, end - nowMin);
  const pct = Math.min(100, Math.max(0, ((nowMin - start) / (end - start)) * 100));
  const claseArea = bloque.areaSlug ? `area-${bloque.areaSlug}` : "";
  const color = bloque.areaSlug ? "var(--c-line)" : "var(--border-strong)";

  return (
    <div className={claseArea}>
      <div className="mb-2.5 flex items-center gap-2.5">
        <div
          className="h-9 w-2 shrink-0 rounded-full"
          style={{ background: color }}
        />
        <div className="min-w-0">
          <p className="truncate text-[16px] font-medium">{bloque.titulo}</p>
          <p className="mt-0.5 text-[12px] text-fg-secondary">
            {[
              bloque.areaLabel,
              `${formatHora(bloque.horaInicio)}–${formatHora(bloque.horaFin!)}`,
              `quedan ${restante} min`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
