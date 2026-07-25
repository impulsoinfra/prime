import { formatFechaLarga, saludo } from "@/lib/date";

export function Greeting() {
  const now = new Date();
  return (
    <header className="mb-4">
      <p className="mb-0.5 text-[13px] text-fg-secondary">
        {formatFechaLarga(now)}
      </p>
      <h1 className="text-[16px] font-medium md:text-[18px]">{saludo(now)}</h1>
    </header>
  );
}
