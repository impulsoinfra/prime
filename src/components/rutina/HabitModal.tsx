"use client";

import { useState, useTransition } from "react";
import {
  actualizarHabito,
  crearHabito,
  eliminarHabito,
  type HabitoInput,
} from "@/actions/habitos";
import { areaSlug } from "@/lib/areas";
import { DIAS_CORTOS, formatHora } from "@/lib/date";
import type { Area, Habito, RutinaBloque } from "@/lib/types";
import { Field, Label, inputClass, selectClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";

const TIPOS = [
  { value: "booleano", label: "Sí / no" },
  { value: "numerico", label: "Cantidad" },
  { value: "duracion", label: "Duración" },
  { value: "escala", label: "Escala" },
];

const UNIDADES = [
  "páginas",
  "L",
  "litros",
  "ml",
  "minutos",
  "horas",
  "km",
  "vasos",
  "veces",
  "repeticiones",
];

export function HabitModal({
  areas,
  bloques,
  habito,
  onClose,
}: {
  areas: Area[];
  bloques: RutinaBloque[];
  habito?: Habito | null;
  onClose: () => void;
}) {
  const editando = !!habito;
  const [nombre, setNombre] = useState(habito?.nombre ?? "");
  const [areaId, setAreaId] = useState(habito?.area_id ?? areas[0]?.id ?? "");
  const [tipo, setTipo] = useState(habito?.tipo ?? "booleano");
  const [meta, setMeta] = useState(habito?.meta != null ? String(habito.meta) : "");
  const [unidad, setUnidad] = useState(habito?.unidad ?? "páginas");
  const [incremento, setIncremento] = useState(
    habito?.incremento_rapido != null ? String(habito.incremento_rapido) : "",
  );
  const [frecuencia, setFrecuencia] = useState<number[]>(
    habito?.frecuencia ?? [0, 1, 2, 3, 4, 5, 6],
  );
  const [vincular, setVincular] = useState(!!habito?.bloque_id);
  const [bloqueId, setBloqueId] = useState(habito?.bloque_id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const conMeta = tipo === "numerico" || tipo === "duracion";
  const unidades =
    habito?.unidad && !UNIDADES.includes(habito.unidad)
      ? [habito.unidad, ...UNIDADES]
      : UNIDADES;

  function toggleDia(d: number) {
    setFrecuencia((f) =>
      f.includes(d) ? f.filter((x) => x !== d) : [...f, d].sort((a, b) => a - b),
    );
  }

  function submit() {
    if (!nombre.trim()) return setError("Poné un nombre.");
    if (!areaId) return setError("Elegí un área.");
    if (frecuencia.length === 0) return setError("Elegí al menos un día.");
    if (conMeta && (!meta || Number(meta) <= 0))
      return setError("La meta tiene que ser mayor a 0.");
    setError(null);

    const input: HabitoInput = {
      area_id: areaId,
      nombre: nombre.trim(),
      tipo,
      meta: conMeta ? Number(meta) : null,
      unidad: conMeta ? unidad : null,
      incremento_rapido: conMeta && incremento ? Number(incremento) : null,
      frecuencia,
      bloque_id: vincular && bloqueId ? bloqueId : null,
    };

    startTransition(async () => {
      try {
        if (habito) await actualizarHabito(habito.id, input);
        else await crearHabito(input);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar.");
      }
    });
  }

  function borrar() {
    if (!habito) return;
    if (!confirm(`¿Eliminar "${habito.nombre}"? Se borran también sus registros.`))
      return;
    startTransition(async () => {
      try {
        await eliminarHabito(habito.id);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al eliminar.");
      }
    });
  }

  return (
    <Modal title={editando ? "Editar hábito" : "Nuevo hábito"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Nombre">
          <input
            className={inputClass}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Leer 20 páginas"
          />
        </Field>

        <div>
          <Label>Área</Label>
          <div className="flex flex-wrap gap-2">
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

        <div>
          <Label>Tipo</Label>
          <div className="flex rounded-[10px] bg-surface-2 p-0.5">
            {TIPOS.map((t) => {
              const sel = t.value === tipo;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={`flex-1 rounded-[8px] py-1.5 text-[12px] transition-colors ${
                    sel ? "bg-accent font-medium text-accent-fg" : "text-fg-muted"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {conMeta ? (
          <div className="grid grid-cols-3 gap-2.5">
            <Field label="Meta">
              <input
                type="number"
                className={inputClass}
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
              />
            </Field>
            <Field label="Unidad">
              <select
                className={selectClass}
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
              >
                {unidades.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="+ rápido">
              <input
                type="number"
                className={inputClass}
                value={incremento}
                onChange={(e) => setIncremento(e.target.value)}
                placeholder="—"
              />
            </Field>
          </div>
        ) : null}

        <div>
          <Label>Frecuencia</Label>
          <div className="flex justify-between">
            {DIAS_CORTOS.map((d, i) => {
              const sel = frecuencia.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDia(i)}
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

        <div className="rounded-[12px] bg-surface-2 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px]">Vincular a bloque de rutina</p>
              <p className="mt-0.5 text-[11px] text-fg-muted">
                Opcional · se marca al completar el bloque
              </p>
            </div>
            <Toggle
              checked={vincular}
              onChange={setVincular}
              label="Vincular a bloque de rutina"
            />
          </div>
          {vincular ? (
            <select
              className={`${selectClass} mt-3`}
              value={bloqueId}
              onChange={(e) => setBloqueId(e.target.value)}
            >
              <option value="">Elegí un bloque…</option>
              {bloques.map((b) => (
                <option key={b.id} value={b.id}>
                  {DIAS_CORTOS[b.dia_semana]} {formatHora(b.hora_inicio)} ·{" "}
                  {b.titulo}
                </option>
              ))}
            </select>
          ) : null}
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
                : "Crear hábito"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
