export function Placeholder({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion: string;
}) {
  return (
    <div>
      <h1 className="mb-4 text-[18px] font-medium">{titulo}</h1>
      <div className="flex min-h-[200px] items-center justify-center rounded-[16px] border border-dashed border-border-strong bg-surface-2 px-6 text-center">
        <p className="max-w-[280px] text-[13px] text-fg-muted">{descripcion}</p>
      </div>
    </div>
  );
}
