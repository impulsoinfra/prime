export function TrendChart({ valores }: { valores: number[] }) {
  const max = Math.max(100, ...valores);

  return (
    <div>
      <div className="flex h-[92px] items-end gap-2.5 rounded-[12px] bg-surface-2 px-4 pt-6">
        {valores.map((v, i) => {
          const ultimo = i === valores.length - 1;
          const alto = Math.max(6, Math.round((v / max) * 64));
          return (
            <div
              key={i}
              className="relative flex-1 rounded-[3px]"
              title={`${v}% de cumplimiento`}
              style={{
                height: alto,
                background: ultimo ? "var(--fill-accent)" : "var(--border-strong)",
              }}
            >
              {ultimo ? (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-medium">
                  {v}%
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between px-4 text-[10px] text-fg-muted">
        <span>Hace 8 semanas</span>
        <span>Esta semana</span>
      </div>
    </div>
  );
}
