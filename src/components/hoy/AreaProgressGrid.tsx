import { AREA_ICONS } from "@/lib/areas";
import type { AreaProgresoVM } from "@/lib/hoy";
import { SegmentedWeekBar } from "./SegmentedWeekBar";

export function AreaProgressGrid({ areas }: { areas: AreaProgresoVM[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {areas.map((a) => {
        const Icon = AREA_ICONS[a.slug];
        return (
          <div
            key={a.slug}
            className={`area-${a.slug} rounded-[16px] p-3`}
            style={{ background: "var(--c-bg)" }}
          >
            <Icon size={16} style={{ color: "var(--c-fg)" }} aria-hidden />
            <p
              className="mt-1.5 mb-2 text-[13px] font-medium"
              style={{ color: "var(--c-fg)" }}
            >
              {a.label}
              <span className="opacity-75">
                {" · "}
                {a.total > 0 ? `${a.cumplidos}/${a.total}` : "—"}
              </span>
            </p>
            <SegmentedWeekBar dias={a.dias} />
          </div>
        );
      })}
    </div>
  );
}
