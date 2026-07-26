"use client";

import {
  IconArrowDown,
  IconArrowUp,
  IconChartLine,
  IconFlame,
  IconTrophy,
  type Icon,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { AREA_ICONS, areaSlug } from "@/lib/areas";
import { mesAnioLabel } from "@/lib/date";
import { cumplimientoRango, mejorRacha, rachaActual } from "@/lib/habits";
import {
  calendarioMes,
  insightMasConstante,
  insightTeCuestaMas,
  porcentajeHabitosRango,
  RANGO_LABEL,
  rangoFechas,
  tendencia8Semanas,
  type RangoTipo,
} from "@/lib/progreso";
import type { Area, Habito, Registro } from "@/lib/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MonthCalendar } from "./MonthCalendar";
import { TrendChart } from "./TrendChart";

const RANGOS: RangoTipo[] = ["semana", "mes", "anio"];

export function ProgresoClient({
  areas,
  habitos,
  registros,
}: {
  areas: Area[];
  habitos: Habito[];
  registros: Registro[];
}) {
  const hoy = useMemo(() => new Date(), []);
  const [rango, setRango] = useState<RangoTipo>("semana");
  const [ym, setYm] = useState({ year: hoy.getFullYear(), month: hoy.getMonth() });

  const data = useMemo(() => {
    const { desde, hasta } = rangoFechas(rango, hoy);
    return {
      rachaAct: rachaActual(habitos, registros, hoy),
      mejor: mejorRacha(habitos, registros, hoy),
      promedio: Math.round(cumplimientoRango(habitos, registros, desde, hasta) * 100),
      tendencia: tendencia8Semanas(habitos, registros, hoy),
      celdas: calendarioMes(habitos, registros, ym.year, ym.month, hoy),
      areasVM: areas.map((a) => ({
        slug: areaSlug(a),
        label: a.nombre,
        pct: Math.round(
          porcentajeHabitosRango(
            habitos.filter((h) => h.area_id === a.id),
            registros,
            desde,
            hasta,
          ).pct * 100,
        ),
      })),
      masConstante: insightMasConstante(habitos, registros, hoy),
      teCuesta: insightTeCuestaMas(habitos, registros, desde, hasta),
    };
  }, [rango, ym, hoy, areas, habitos, registros]);

  function prevMes() {
    setYm(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  }
  function nextMes() {
    setYm(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[18px] font-medium">Progreso</h1>
        <div className="flex rounded-[20px] bg-surface-2 p-0.5">
          {RANGOS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRango(r)}
              className={`rounded-[16px] px-3 py-1.5 text-[12px] transition-colors ${
                rango === r
                  ? "bg-accent font-medium text-accent-fg"
                  : "text-fg-muted"
              }`}
            >
              {RANGO_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-6 lg:grid lg:grid-cols-[1.4fr_1fr]">
        <MonthCalendar
          label={mesAnioLabel(ym.year, ym.month)}
          celdas={data.celdas}
          onPrev={prevMes}
          onNext={nextMes}
        />

        <div>
          <div className="mb-4 flex flex-col gap-2">
            <StatCard
              icon={IconFlame}
              iconColor="var(--warning)"
              valor={`${data.rachaAct} días`}
              label="Racha actual"
            />
            <StatCard
              icon={IconTrophy}
              iconColor="var(--text-muted)"
              valor={`${data.mejor} días`}
              label="Mejor racha"
            />
            <StatCard
              icon={IconChartLine}
              iconColor="var(--text-muted)"
              valor={`${data.promedio}%`}
              label={`Promedio · ${RANGO_LABEL[rango]}`}
            />
          </div>

          <SectionTitle>Progreso por área</SectionTitle>
          <div>
            {data.areasVM.map((a) => {
              const Icon = AREA_ICONS[a.slug];
              return (
                <div
                  key={a.slug}
                  className={`area-${a.slug} flex items-center gap-1.5 py-1.5`}
                  title={`${a.label}: ${a.pct}%`}
                >
                  <Icon
                    size={13}
                    style={{ color: "var(--c-line)" }}
                    aria-hidden
                  />
                  <span className="sr-only">{a.label}</span>
                  <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${a.pct}%`, background: "var(--c-line)" }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-fg-secondary">
                    {a.pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <SectionTitle>Tendencia de cumplimiento</SectionTitle>
      <div className="mb-5">
        <TrendChart valores={data.tendencia} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InsightCard
          bg="var(--bg-success)"
          color="var(--success)"
          icon={IconArrowUp}
          titulo="Más constante"
          texto={
            data.masConstante
              ? `${data.masConstante.nombre} · ${data.masConstante.detalle}`
              : "Todavía sin datos suficientes"
          }
        />
        <InsightCard
          bg="var(--bg-warning)"
          color="var(--warning)"
          icon={IconArrowDown}
          titulo="Te cuesta más"
          texto={
            data.teCuesta
              ? `${data.teCuesta.nombre} · ${data.teCuesta.detalle}`
              : "Todavía sin datos suficientes"
          }
        />
      </div>
    </>
  );
}

function StatCard({
  icon: Icon,
  iconColor,
  valor,
  label,
}: {
  icon: Icon;
  iconColor: string;
  valor: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-[12px] border border-border bg-surface-1 px-3 py-2.5">
      <Icon size={16} style={{ color: iconColor }} aria-hidden />
      <div>
        <p className="text-[15px] font-medium leading-none">{valor}</p>
        <p className="mt-1 text-[10px] text-fg-muted">{label}</p>
      </div>
    </div>
  );
}

function InsightCard({
  bg,
  color,
  icon: Icon,
  titulo,
  texto,
}: {
  bg: string;
  color: string;
  icon: Icon;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="rounded-[12px] p-3.5" style={{ background: bg }}>
      <Icon size={15} style={{ color }} aria-hidden />
      <p className="mt-1.5 text-[13px] font-medium" style={{ color }}>
        {titulo}
      </p>
      <p className="mt-0.5 text-[12px] text-fg">{texto}</p>
    </div>
  );
}
