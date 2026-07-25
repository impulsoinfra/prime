import { IconClock } from "@tabler/icons-react";
import { formatHora, timeToMinutes } from "@/lib/date";
import { AREA_ICONS } from "@/lib/areas";
import type { BloqueVM } from "@/lib/hoy";

export function DayTimeline({
  bloques,
  nowMin,
}: {
  bloques: BloqueVM[];
  nowMin: number;
}) {
  if (bloques.length === 0) {
    return (
      <p className="text-[12px] text-fg-muted">
        No hay bloques de rutina para hoy.
      </p>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {bloques.map((b) => {
        const start = timeToMinutes(b.horaInicio);
        const end = b.horaFin ? timeToMinutes(b.horaFin) : start;
        const activo = b.horaFin != null && start <= nowMin && nowMin < end;
        const Icon = b.areaSlug ? AREA_ICONS[b.areaSlug] : IconClock;
        const color = b.areaSlug ? "var(--c-line)" : "var(--text-muted)";

        return (
          <div
            key={b.id}
            title={`${b.titulo}${b.areaLabel ? ` · ${b.areaLabel}` : ""} · ${formatHora(b.horaInicio)}`}
            className={`${b.areaSlug ? `area-${b.areaSlug}` : ""} w-[56px] shrink-0 text-center ${
              activo ? "scale-105" : ""
            }`}
          >
            <div
              className="mb-1.5 h-[3px] rounded-full"
              style={{ background: b.areaSlug ? "var(--c-line)" : "var(--border)" }}
            />
            <Icon size={activo ? 17 : 15} style={{ color }} aria-hidden />
            <p
              className={`mt-1 text-[10px] ${
                activo ? "font-medium text-fg" : "text-fg-muted"
              }`}
            >
              {formatHora(b.horaInicio)}
            </p>
            <span className="sr-only">{b.titulo}</span>
          </div>
        );
      })}
    </div>
  );
}
