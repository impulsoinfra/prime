/** 7 segmentos (lun→dom). Opacidad según el ratio de objetivos del área cumplidos
 *  ese día (0–1); null = sin objetivos / futuro (muy tenue).
 *  Debe renderizarse dentro de un contenedor con clase .area-* (define --c-line). */
export function SegmentedWeekBar({ dias }: { dias: (number | null)[] }) {
  return (
    <div className="flex gap-[3px]" role="img" aria-label={describir(dias)}>
      {dias.map((d, i) => (
        <span
          key={i}
          className="h-1 flex-1 rounded-full"
          style={{
            background: "var(--c-line)",
            opacity: d == null ? 0.15 : 0.3 + 0.7 * d,
          }}
        />
      ))}
    </div>
  );
}

function describir(dias: (number | null)[]): string {
  const completos = dias.filter((d) => d != null && d >= 1).length;
  return `${completos} día(s) completos esta semana`;
}
