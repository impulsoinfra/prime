"use client";

import {
  IconCheck,
  IconLink,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { incrementarValor, setValor } from "@/actions/registros";
import type { HabitoVM } from "@/lib/hoy";

function recompute(h: HabitoVM, valor: number): HabitoVM {
  const cumplido =
    h.tipo === "booleano"
      ? valor >= 1
      : h.tipo === "escala"
        ? valor >= 4
        : valor >= h.meta;
  return { ...h, valor, cumplido };
}

function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

export function HabitChecklist({ habitos }: { habitos: HabitoVM[] }) {
  const [optimistas, aplicar] = useOptimistic(
    habitos,
    (state, u: { id: string; valor: number }) =>
      state.map((h) => (h.id === u.id ? recompute(h, u.valor) : h)),
  );
  const [, startTransition] = useTransition();

  function set(id: string, valor: number) {
    startTransition(async () => {
      aplicar({ id, valor });
      try {
        await setValor(id, valor);
      } catch {
        // La revalidación restaura el valor real ante un error.
      }
    });
  }

  function inc(id: string, incremento: number, actual: number) {
    startTransition(async () => {
      aplicar({ id, valor: actual + incremento });
      try {
        await incrementarValor(id, incremento);
      } catch {
        // idem
      }
    });
  }

  if (optimistas.length === 0) {
    return (
      <p className="rounded-[12px] border border-dashed border-border-strong bg-surface-2 px-4 py-6 text-center text-[13px] text-fg-muted">
        No tenés hábitos para hoy. Agregalos desde Rutina.
      </p>
    );
  }

  return (
    <div className="border-b border-border md:grid md:grid-cols-2 md:gap-x-6">
      {optimistas.map((h) => (
        <HabitRow
          key={h.id}
          h={h}
          onSet={(v) => set(h.id, v)}
          onIncrement={(i) => inc(h.id, i, h.valor)}
        />
      ))}
    </div>
  );
}

const ROW = "flex items-center gap-2.5 border-t border-border py-2.5";
const CONTROL =
  "flex size-[26px] shrink-0 items-center justify-center rounded-full";

function Dot() {
  return (
    <span
      className="size-1.5 shrink-0 rounded-full"
      style={{ background: "var(--c-line)" }}
      aria-hidden
    />
  );
}

function HabitRow({
  h,
  onSet,
  onIncrement,
}: {
  h: HabitoVM;
  onSet: (valor: number) => void;
  onIncrement: (incremento: number) => void;
}) {
  const [running, setRunning] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const rowClass = `area-${h.areaSlug} ${ROW}`;

  // ── booleano ──
  if (h.tipo === "booleano") {
    return (
      <div className={rowClass}>
        <button
          type="button"
          onClick={() => onSet(h.cumplido ? 0 : 1)}
          aria-pressed={h.cumplido}
          aria-label={h.nombre}
          className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
            h.cumplido ? "" : "border-[1.5px] border-border-strong"
          }`}
          style={h.cumplido ? { background: "var(--fill-success)" } : undefined}
        >
          {h.cumplido ? (
            <IconCheck
              size={13}
              style={{ color: "var(--on-success)" }}
              aria-hidden
            />
          ) : null}
        </button>
        <Dot />
        <p className="flex flex-1 items-center gap-1 text-[13px]">
          {h.nombre}
          {h.vinculado ? (
            <IconLink size={12} className="text-fg-muted" aria-hidden />
          ) : null}
        </p>
      </div>
    );
  }

  // ── numerico / duracion ──
  const esTimer = h.tipo === "duracion";
  const elapsedMin = elapsedSec / 60;
  const display = esTimer && running ? h.valor + elapsedMin : h.valor;
  const pct =
    h.meta > 0
      ? Math.min(100, (display / h.meta) * 100)
      : display > 0
        ? 100
        : 0;

  function stopTimer() {
    setRunning(false);
    const nuevo = Math.round((h.valor + elapsedMin) * 10) / 10;
    setElapsedSec(0);
    onSet(nuevo);
  }

  return (
    <div className={rowClass}>
      <Dot />
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 flex items-center gap-1 text-[13px]">
          <span className="truncate">
            {h.nombre} · {formatNum(display)} / {formatNum(h.meta)}
            {h.unidad ? ` ${h.unidad}` : ""}
          </span>
          {h.vinculado ? (
            <IconLink size={12} className="shrink-0 text-fg-muted" aria-hidden />
          ) : null}
        </p>
        <div className="h-[5px] overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full transition-[width]"
            style={{ width: `${pct}%`, background: "var(--c-line)" }}
          />
        </div>
      </div>

      {esTimer ? (
        <button
          type="button"
          onClick={running ? stopTimer : () => setRunning(true)}
          aria-label={`${running ? "Pausar" : "Iniciar"} ${h.nombre}`}
          className={CONTROL}
          style={{ background: "var(--fill-accent)", color: "var(--on-accent)" }}
        >
          {running ? (
            <IconPlayerPause size={13} aria-hidden />
          ) : (
            <IconPlayerPlay size={13} aria-hidden />
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onIncrement(h.incrementoRapido ?? 1)}
          aria-label={`Sumar a ${h.nombre}`}
          className={`${CONTROL} border-[0.5px] border-border-strong text-fg-secondary`}
        >
          <IconPlus size={13} aria-hidden />
        </button>
      )}
    </div>
  );
}
