export const inputClass =
  "w-full rounded-[10px] border border-border bg-surface-1 px-3 py-2.5 text-[13px] text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-accent";

export const selectClass = `${inputClass} appearance-none`;

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[12px] text-fg-secondary">{children}</span>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
