import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { DIAS_CORTOS } from "@/lib/date";
import { bucketOpacidad, type CeldaCal } from "@/lib/progreso";

function mezcla(op: number): string {
  return `color-mix(in srgb, var(--accent) ${Math.round(op * 100)}%, transparent)`;
}

function Cell({ c }: { c: CeldaCal }) {
  const base =
    "flex h-[34px] items-center justify-center rounded-[8px] text-[12px]";

  if (c.tipo === "adj") {
    return (
      <div className={`${base} text-fg-muted opacity-35`} aria-hidden>
        {c.dia}
      </div>
    );
  }
  if (c.tipo === "future") {
    return (
      <div className={`${base} border border-dashed border-border text-fg-muted`}>
        {c.dia}
      </div>
    );
  }

  const pct = c.pct ?? 0;
  const op = bucketOpacidad(pct);
  const fuerte = op >= 0.55;
  return (
    <div
      className={`${base} font-medium`}
      title={`${c.dia} · ${Math.round(pct * 100)}% cumplido`}
      style={{
        background: mezcla(op),
        color: fuerte ? "var(--accent-fg)" : "var(--text-secondary)",
        boxShadow: c.tipo === "today" ? "0 0 0 1.5px var(--accent)" : undefined,
      }}
    >
      {c.dia}
    </div>
  );
}

export function MonthCalendar({
  label,
  celdas,
  onPrev,
  onNext,
}: {
  label: string;
  celdas: CeldaCal[];
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <button type="button" onClick={onPrev} aria-label="Mes anterior">
          <IconChevronLeft size={16} className="text-fg-muted" aria-hidden />
        </button>
        <span className="text-[13px] font-medium">{label}</span>
        <button type="button" onClick={onNext} aria-label="Mes siguiente">
          <IconChevronRight size={16} className="text-fg-muted" aria-hidden />
        </button>
      </div>

      <div className="mb-1.5 grid grid-cols-7 gap-1">
        {DIAS_CORTOS.map((d, i) => (
          <span key={i} className="text-center text-[10px] text-fg-muted">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((c) => (
          <Cell key={c.key} c={c} />
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-end gap-1">
        <span className="text-[10px] text-fg-muted">Menos</span>
        {[0.12, 0.35, 0.7, 1].map((op) => (
          <span
            key={op}
            className="size-2 rounded-[2px]"
            style={{ background: mezcla(op) }}
          />
        ))}
        <span className="text-[10px] text-fg-muted">Más</span>
      </div>
    </div>
  );
}
