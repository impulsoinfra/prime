import { DIAS_CORTOS } from "@/lib/date";

/** 7 segmentos (lun→dom). Cumplido = color pleno; no cumplido/sin dato = 25% opacidad.
 *  Debe renderizarse dentro de un contenedor con clase .area-* (define --c-line). */
export function SegmentedWeekBar({ dias }: { dias: (boolean | null)[] }) {
  return (
    <div className="flex gap-[3px]" role="img" aria-label={describir(dias)}>
      {dias.map((d, i) => (
        <span
          key={i}
          className="h-1 flex-1 rounded-full"
          style={{ background: "var(--c-line)", opacity: d ? 1 : 0.25 }}
        />
      ))}
    </div>
  );
}

function describir(dias: (boolean | null)[]): string {
  const cumplidos = dias
    .map((d, i) => (d ? DIAS_CORTOS[i] : null))
    .filter(Boolean)
    .join(", ");
  return cumplidos ? `Días cumplidos: ${cumplidos}` : "Sin días cumplidos";
}
