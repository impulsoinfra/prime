"use client";

import { useState, useTransition } from "react";
import {
  actualizarBloque,
  crearBloque,
  eliminarBloque,
  type BloqueInput,
} from "@/actions/rutina";
import { areaSlug } from "@/lib/areas";
import { DIAS_CORTOS } from "@/lib/date";
import type { Area, RutinaBloque } from "@/lib/types";
import { Field, Label, inputClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/Modal";

export function BlockModal({
  areas,
  bloque,
  diaInicial,
  onClose,
}: {
  areas: Area[];
  bloque?: RutinaBloque | null;
  diaInicial: number;
  onClose: () => void;
}) {
  const editando = !!bloque;
  const [dia, setDia] = useState(bloque?.dia_semana ?? diaInicial);
  const [titulo, setTitulo] = useState(bloque?.titulo ?? "");
  const [inicio, setInicio] = useState(
    bloque ? bloque.hora_inicio.slice(0, 5) : "09:00",
  );
  const [fin, setFin] = useState(bloque?.hora_fin ? bloque.hora_fin.slice(0, 5) : "");
  const [descripcion, setDescripcion] = useState(bloque?.descripcion ?? "");
  const [areaId, setAreaId] = useState<string | null>(bloque?.area_id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!titulo.trim()) return setError("Poné un título.");
    if (!inicio) return setError("Elegí una hora de inicio.");
    if (fin && fin <= inicio)
      return setError("La hora de fin tiene que ser posterior al inicio.");
    setError(null);

    const input: BloqueInput = {
      dia_semana: dia,
      hora_inicio: inicio,
      hora_fin: fin || null,
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || null,
      area_id: areaId,
    };

    startTransition(async () => {
      try {
        if (bloque) await actualizarBloque(bloque.id, input);
        else await crearBloque(input);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar.");
      }
    });
  }

  function borrar() {
    if (!bloque) return;
    if (!confirm(`¿Eliminar el bloque "${bloque.titulo}"?`)) return;
    startTransition(async () => {
      try {
        await eliminarBloque(bloque.id);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al eliminar.");
      }
    });
  }

  return (
    <Modal title={editando ? "Editar bloque" : "Nuevo bloque"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Título">
          <input
            className={inputClass}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Bloque de foco"
          />
        </Field>

        <div>
          <Label>Día</Label>
          <div className="flex justify-between">
            {DIAS_CORTOS.map((d, i) => {
              const sel = i === dia;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDia(i)}
                  aria-pressed={sel}
                  aria-label={`Día ${i + 1}`}
                  className={`flex size-[30px] items-center justify-center rounded-full text-[12px] transition-colors ${
                    sel
                      ? "bg-accent text-accent-fg"
                      : "border border-border bg-surface-2 text-fg-secondary"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Field label="Inicio">
            <input
              type="time"
              className={inputClass}
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
          </Field>
          <Field label="Fin (opcional)">
            <input
              type="time"
              className={inputClass}
              value={fin}
              onChange={(e) => setFin(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Descripción (opcional)">
          <input
            className={inputClass}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Movilidad, inglés, lectura…"
          />
        </Field>

        <div>
          <Label>Área (opcional)</Label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAreaId(null)}
              className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                areaId === null
                  ? "border-border-strong bg-surface-2 text-fg"
                  : "border-border bg-surface-2 text-fg-secondary"
              }`}
            >
              Ninguna
            </button>
            {areas.map((a) => {
              const sel = a.id === areaId;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAreaId(a.id)}
                  className={`area-${areaSlug(a)} rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                    sel ? "" : "border-border bg-surface-2 text-fg-secondary"
                  }`}
                  style={
                    sel
                      ? {
                          background: "var(--c-bg)",
                          color: "var(--c-fg)",
                          borderColor: "var(--c-line)",
                        }
                      : undefined
                  }
                >
                  {a.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {error ? <p className="text-[12px] text-danger">{error}</p> : null}

        <div className="flex gap-2.5">
          {editando ? (
            <button
              type="button"
              onClick={borrar}
              disabled={pending}
              className="rounded-[10px] border border-border px-3 py-2.5 text-[13px] text-danger disabled:opacity-60"
            >
              Eliminar
            </button>
          ) : null}
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="flex-1 rounded-[10px] bg-accent px-3 py-2.5 text-[13px] font-medium text-accent-fg disabled:opacity-60"
          >
            {pending
              ? "Guardando…"
              : editando
                ? "Guardar cambios"
                : "Crear bloque"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
