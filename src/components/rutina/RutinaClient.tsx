"use client";

import { IconChevronRight, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { areaSlug } from "@/lib/areas";
import {
  addDays,
  DIAS_CORTOS,
  formatHora,
  getDiaSemana,
  startOfWeek,
} from "@/lib/date";
import type { Area, Habito, RutinaBloque } from "@/lib/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BlockModal } from "./BlockModal";
import { CopyDayModal } from "./CopyDayModal";
import { HabitModal } from "./HabitModal";

type ModalState =
  | { tipo: "bloque-nuevo" }
  | { tipo: "bloque-editar"; bloque: RutinaBloque }
  | { tipo: "habito-nuevo" }
  | { tipo: "habito-editar"; habito: Habito }
  | { tipo: "copiar" }
  | null;

function metaTexto(h: Habito): string {
  if (h.tipo === "booleano") return "Sí / no";
  if (h.tipo === "escala") return "Escala 1–5";
  return `Meta: ${h.meta ?? "—"}${h.unidad ? ` ${h.unidad}` : ""}`;
}

export function RutinaClient({
  areas,
  bloques,
  habitos,
}: {
  areas: Area[];
  bloques: RutinaBloque[];
  habitos: Habito[];
}) {
  const hoy = new Date();
  const [selectedDia, setSelectedDia] = useState(getDiaSemana(hoy));
  const [modal, setModal] = useState<ModalState>(null);

  const lunes = startOfWeek(hoy);
  const areaById = new Map(areas.map((a) => [a.id, a]));

  const bloquesDelDia = bloques
    .filter((b) => b.dia_semana === selectedDia)
    .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));

  const objetivos = habitos.filter((h) => h.bloque_id == null);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[18px] font-medium">Rutina</h1>
        <button
          type="button"
          onClick={() => setModal({ tipo: "copiar" })}
          className="text-[12px] text-accent"
        >
          Copiar día
        </button>
      </div>

      {/* Selector de día */}
      <div className="mb-5 flex justify-between rounded-[12px] border border-border bg-surface-1 px-3 py-2.5 sm:px-4">
        {DIAS_CORTOS.map((letra, i) => {
          const fecha = addDays(lunes, i).getDate();
          const sel = i === selectedDia;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedDia(i)}
              aria-pressed={sel}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`text-[11px] ${sel ? "font-medium text-fg" : "text-fg-muted"}`}
              >
                {letra}
              </span>
              <span
                className={`flex size-7 items-center justify-center rounded-full text-[12px] ${
                  sel
                    ? "bg-accent font-medium text-accent-fg"
                    : "text-fg-secondary"
                }`}
              >
                {fecha}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Bloques del día */}
        <div>
          <SectionTitle>Bloques del día</SectionTitle>
          {bloquesDelDia.length === 0 ? (
            <p className="py-3 text-[13px] text-fg-muted">
              No hay bloques este día.
            </p>
          ) : (
            <div className="border-b border-border">
              {bloquesDelDia.map((b) => {
                const area = b.area_id ? areaById.get(b.area_id) : undefined;
                const slug = area ? areaSlug(area) : null;
                const horario = b.hora_fin
                  ? `${formatHora(b.hora_inicio)}–${formatHora(b.hora_fin)}`
                  : formatHora(b.hora_inicio);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setModal({ tipo: "bloque-editar", bloque: b })}
                    className={`${slug ? `area-${slug}` : ""} flex w-full items-center gap-2.5 border-t border-border py-2.5 text-left`}
                  >
                    <span
                      className="h-6 w-[5px] shrink-0 rounded-full"
                      style={{
                        background: slug ? "var(--c-line)" : "var(--border-strong)",
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[13px]">
                        {horario} · {b.titulo}
                      </span>
                      {b.descripcion ? (
                        <span className="mt-0.5 block truncate text-[11px] text-fg-muted">
                          {b.descripcion}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-[11px] text-fg-muted">Editar</span>
                  </button>
                );
              })}
            </div>
          )}
          <button
            type="button"
            onClick={() => setModal({ tipo: "bloque-nuevo" })}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-border-strong py-2.5 text-[13px] text-fg-secondary transition-colors hover:bg-surface-2"
          >
            <IconPlus size={14} aria-hidden />
            Agregar bloque
          </button>
        </div>

        {/* Objetivos sin horario */}
        <div>
          <SectionTitle>Objetivos sin horario</SectionTitle>
          <p className="mt-[-4px] mb-2 text-[11px] text-fg-muted">
            Se cumplen en cualquier momento
          </p>
          <div className="flex flex-col gap-2">
            {objetivos.length === 0 ? (
              <p className="py-2 text-[13px] text-fg-muted">
                No hay objetivos sin horario.
              </p>
            ) : (
              objetivos.map((h) => {
                const area = areaById.get(h.area_id);
                const slug = area ? areaSlug(area) : "fisico";
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setModal({ tipo: "habito-editar", habito: h })}
                    className={`area-${slug} rounded-[12px] border border-border bg-surface-1 p-3 text-left`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="mt-1 size-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--c-line)" }}
                        aria-hidden
                      />
                      <IconChevronRight
                        size={14}
                        className="text-fg-muted"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-1.5 text-[13px]">{h.nombre}</p>
                    <p className="mt-0.5 text-[11px] text-fg-muted">
                      {metaTexto(h)}
                    </p>
                  </button>
                );
              })
            )}
          </div>
          <button
            type="button"
            onClick={() => setModal({ tipo: "habito-nuevo" })}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-border-strong py-2.5 text-[13px] text-fg-secondary transition-colors hover:bg-surface-2"
          >
            <IconPlus size={14} aria-hidden />
            Agregar objetivo
          </button>
        </div>
      </div>

      {modal?.tipo === "bloque-nuevo" ? (
        <BlockModal
          areas={areas}
          diaInicial={selectedDia}
          onClose={() => setModal(null)}
        />
      ) : null}
      {modal?.tipo === "bloque-editar" ? (
        <BlockModal
          areas={areas}
          bloque={modal.bloque}
          diaInicial={selectedDia}
          onClose={() => setModal(null)}
        />
      ) : null}
      {modal?.tipo === "habito-nuevo" ? (
        <HabitModal areas={areas} onClose={() => setModal(null)} />
      ) : null}
      {modal?.tipo === "habito-editar" ? (
        <HabitModal
          areas={areas}
          habito={modal.habito}
          onClose={() => setModal(null)}
        />
      ) : null}
      {modal?.tipo === "copiar" ? (
        <CopyDayModal diaOrigen={selectedDia} onClose={() => setModal(null)} />
      ) : null}
    </>
  );
}
