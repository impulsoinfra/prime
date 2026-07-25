"use client";

import { useState, useTransition } from "react";
import { copiarDiaA } from "@/actions/rutina";
import { DIAS_CORTOS } from "@/lib/date";
import { Modal } from "@/components/ui/Modal";

const DIA_NOMBRE = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export function CopyDayModal({
  diaOrigen,
  onClose,
}: {
  diaOrigen: number;
  onClose: () => void;
}) {
  const [destinos, setDestinos] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(d: number) {
    setDestinos((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  function preseleccionarLV() {
    setDestinos([0, 1, 2, 3, 4].filter((d) => d !== diaOrigen));
  }

  function copiar() {
    if (destinos.length === 0) return setError("Elegí al menos un día.");
    setError(null);
    startTransition(async () => {
      try {
        await copiarDiaA(diaOrigen, destinos);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al copiar.");
      }
    });
  }

  return (
    <Modal title={`Copiar rutina del ${DIA_NOMBRE[diaOrigen]}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-[13px] text-fg-secondary">
          Elegí a qué días copiarla. Se{" "}
          <span className="text-fg">reemplazan</span> los bloques que ya tengan
          esos días.
        </p>

        <div className="flex justify-between">
          {DIAS_CORTOS.map((letra, i) => {
            const esOrigen = i === diaOrigen;
            const sel = destinos.includes(i);
            return (
              <button
                key={i}
                type="button"
                disabled={esOrigen}
                onClick={() => toggle(i)}
                aria-pressed={sel}
                aria-label={DIA_NOMBRE[i]}
                title={esOrigen ? "Día de origen" : DIA_NOMBRE[i]}
                className={`flex size-[34px] items-center justify-center rounded-full text-[12px] transition-colors ${
                  esOrigen
                    ? "cursor-not-allowed border border-dashed border-border text-fg-muted opacity-50"
                    : sel
                      ? "bg-accent text-accent-fg"
                      : "border border-border bg-surface-2 text-fg-secondary"
                }`}
              >
                {letra}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={preseleccionarLV}
          className="self-start text-[12px] text-accent"
        >
          Seleccionar Lun–Vie
        </button>

        {error ? <p className="text-[12px] text-danger">{error}</p> : null}

        <button
          type="button"
          onClick={copiar}
          disabled={pending || destinos.length === 0}
          className="rounded-[10px] bg-accent px-3 py-2.5 text-[13px] font-medium text-accent-fg disabled:opacity-60"
        >
          {pending
            ? "Copiando…"
            : `Copiar${destinos.length ? ` a ${destinos.length} día${destinos.length > 1 ? "s" : ""}` : ""}`}
        </button>
      </div>
    </Modal>
  );
}
