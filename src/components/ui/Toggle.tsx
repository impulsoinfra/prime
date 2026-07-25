"use client";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-5 w-[34px] shrink-0 rounded-[10px] transition-colors"
      style={{
        background: checked ? "var(--fill-accent)" : "var(--border-strong)",
      }}
    >
      <span
        className="absolute top-0.5 size-4 rounded-full transition-all"
        style={{
          left: checked ? "16px" : "2px",
          background: checked ? "var(--on-accent)" : "var(--surface-1)",
        }}
      />
    </button>
  );
}
