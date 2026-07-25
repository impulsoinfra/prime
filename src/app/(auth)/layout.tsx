import { PrimeMark } from "@/components/ui/PrimeMark";

const AREAS = ["fisico", "mental", "personal", "laboral"] as const;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface-1 px-5 py-10">
      <div className="flex w-full max-w-[640px] overflow-hidden rounded-[16px] border border-border">
        {/* Panel de marca (área Físico) — oculto en mobile */}
        <aside
          className="area-fisico hidden w-[240px] shrink-0 flex-col p-8 sm:flex"
          style={{ background: "var(--c-bg)" }}
        >
          <div
            className="mb-14 flex items-center gap-2"
            style={{ color: "var(--c-fg)" }}
          >
            <span style={{ color: "var(--c-line)" }}>
              <PrimeMark size={20} dotColor="var(--c-fg)" />
            </span>
            <span className="font-voice text-[17px] leading-none">prime</span>
          </div>

          <p
            className="font-voice mb-3 text-[22px] leading-[1.35] italic"
            style={{ color: "var(--c-fg)" }}
          >
            &ldquo;La disciplina de hoy es la libertad de mañana.&rdquo;
          </p>
          <p
            className="text-[12px] opacity-70"
            style={{ color: "var(--c-fg)" }}
          >
            se personaliza desde tu perfil
          </p>

          <div className="mt-auto flex gap-1.5 pt-10">
            {AREAS.map((s) => (
              <span
                key={s}
                className={`area-${s} size-[7px] rounded-full`}
                style={{ background: "var(--c-line)" }}
              />
            ))}
          </div>
        </aside>

        {/* Panel del formulario */}
        <div className="flex-1 bg-surface-2 p-8 sm:p-9">
          <div className="mb-6 flex items-center gap-2 sm:hidden">
            <PrimeMark size={22} />
            <span className="font-voice text-[20px] leading-none">prime</span>
          </div>
          {children}
        </div>
      </div>

      <p className="mt-6 text-[12px] text-fg-muted">
        prime ·{" "}
        <a href="#" className="hover:text-fg-secondary">
          Términos
        </a>{" "}
        ·{" "}
        <a href="#" className="hover:text-fg-secondary">
          Privacidad
        </a>
      </p>
    </main>
  );
}
