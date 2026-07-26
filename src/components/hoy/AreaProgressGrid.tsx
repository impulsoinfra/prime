"use client";

import { useState } from "react";
import { AREA_ICONS } from "@/lib/areas";
import type { AreaProgresoVM } from "@/lib/hoy";
import { SegmentedWeekBar } from "./SegmentedWeekBar";

type Modo = "hoy" | "semana";

export function AreaProgressGrid({ areas }: { areas: AreaProgresoVM[] }) {
  const [modo, setModo] = useState<Modo>("hoy");

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[13px] font-medium text-fg-secondary">
          Progreso por área
        </p>
        <div className="flex rounded-[10px] bg-surface-2 p-0.5">
          {(["hoy", "semana"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModo(m)}
              className={`rounded-[8px] px-2.5 py-1 text-[11px] transition-colors ${
                modo === m
                  ? "bg-accent font-medium text-accent-fg"
                  : "text-fg-muted"
              }`}
            >
              {m === "hoy" ? "Hoy" : "Semana"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {areas.map((a) => {
          const Icon = AREA_ICONS[a.slug];
          const etiqueta = !a.tieneHabitos
            ? "—"
            : modo === "hoy"
              ? a.hoyTotal > 0
                ? `${a.hoyCumplidos}/${a.hoyTotal}`
                : "—"
              : `${a.pct}%`;

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
                  {etiqueta}
                </span>
              </p>
              {modo === "hoy" ? (
                <DayBar pct={a.hoyTotal > 0 ? a.hoyPct : 0} />
              ) : (
                <SegmentedWeekBar dias={a.dias} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/** Barra de progreso del día (usa --c-line del área). */
function DayBar({ pct }: { pct: number }) {
  return (
    <div
      className="h-1 overflow-hidden rounded-full"
      style={{ background: "color-mix(in srgb, var(--c-line) 22%, transparent)" }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: "var(--c-line)" }}
      />
    </div>
  );
}
