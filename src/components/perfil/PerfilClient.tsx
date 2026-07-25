"use client";

import {
  IconApps,
  IconBell,
  IconChevronRight,
  IconDownload,
  IconGripVertical,
  IconLanguage,
  IconLock,
  IconLogout,
  IconMoon,
  IconPencil,
  IconPlus,
  IconChevronUp,
  IconChevronDown,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useTransition } from "react";
import { signOut } from "@/actions/auth";
import {
  actualizarNombre,
  actualizarPerfil,
  cambiarPassword,
} from "@/actions/perfil";
import { iniciales, nombreVisible } from "@/lib/user";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { inputClass } from "@/components/ui/form";
import { SectionTitle } from "@/components/ui/SectionTitle";

type ExportRow = {
  fecha: string;
  habito: string;
  valor: number;
  nota: string | null;
};

const TEMAS: { value: string; label: string; next: string }[] = [
  { value: "claro", label: "Claro", next: "light" },
  { value: "oscuro", label: "Oscuro", next: "dark" },
  { value: "sistema", label: "Sistema", next: "system" },
];

export function PerfilClient({
  nombre,
  email,
  prioridades: prioridadesIniciales,
  frase: fraseInicial,
  tema: temaInicial,
  stats,
  exportRows,
}: {
  nombre: string;
  email: string;
  prioridades: string[];
  frase: string | null;
  tema: string;
  stats: { rachaAct: number; mejor: number; diasActivos: number };
  exportRows: ExportRow[];
}) {
  return (
    <>
      <h1 className="mb-4 text-[18px] font-medium">Perfil</h1>

      <AccountCard nombre={nombre} email={email} />

      <div className="mb-6 grid grid-cols-3 gap-2.5">
        <Stat valor={stats.rachaAct} label="Racha actual" />
        <Stat valor={stats.mejor} label="Mejor racha" />
        <Stat valor={stats.diasActivos} label="Días activos" />
      </div>

      <SectionTitle>Tus prioridades</SectionTitle>
      <PrioridadesEditor iniciales={prioridadesIniciales} />

      <div className="mb-6">
        <FraseEditor inicial={fraseInicial} />
      </div>

      <SectionTitle>General</SectionTitle>
      <div className="mb-6">
        <Link
          href="/app/rutina"
          className="flex items-center gap-2.5 border-t border-border py-2.5"
        >
          <IconApps size={16} className="text-fg-secondary" aria-hidden />
          <span className="flex-1 text-[13px]">Áreas y hábitos</span>
          <IconChevronRight size={14} className="text-fg-muted" aria-hidden />
        </Link>

        <div className="border-t border-border py-2.5">
          <div className="mb-2 flex items-center gap-2.5">
            <IconMoon size={16} className="text-fg-secondary" aria-hidden />
            <span className="flex-1 text-[13px]">Tema</span>
          </div>
          <ThemeSelector temaInicial={temaInicial} />
        </div>

        <div className="flex items-center gap-2.5 border-t border-border py-2.5">
          <IconBell size={16} className="text-fg-secondary" aria-hidden />
          <span className="flex-1 text-[13px]">Notificaciones</span>
          <NotifToggle />
        </div>

        <div className="flex items-center gap-2.5 border-t border-b border-border py-2.5">
          <IconLanguage size={16} className="text-fg-secondary" aria-hidden />
          <span className="flex-1 text-[13px]">Idioma</span>
          <span className="text-[12px] text-fg-muted">Español</span>
        </div>
      </div>

      <SectionTitle>Cuenta</SectionTitle>
      <CuentaSection exportRows={exportRows} />
    </>
  );
}

/* ── Cuenta: avatar + nombre editable ── */
function AccountCard({ nombre, email }: { nombre: string; email: string }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(nombre);
  const [pending, startTransition] = useTransition();

  function guardar() {
    const nuevo = valor.trim();
    if (!nuevo || nuevo === nombre) {
      setEditando(false);
      return;
    }
    startTransition(async () => {
      try {
        await actualizarNombre(nuevo);
      } catch {
        setValor(nombre);
      }
      setEditando(false);
    });
  }

  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[var(--fill-control)] text-[16px] font-medium text-fg-secondary">
        {iniciales(nombre, email)}
      </span>
      <div className="min-w-0 flex-1">
        {editando ? (
          <input
            autoFocus
            className={inputClass}
            value={valor}
            disabled={pending}
            onChange={(e) => setValor(e.target.value)}
            onBlur={guardar}
            onKeyDown={(e) => e.key === "Enter" && guardar()}
          />
        ) : (
          <>
            <p className="truncate text-[15px] font-medium">
              {nombreVisible(nombre, email)}
            </p>
            <p className="truncate text-[12px] text-fg-muted">{email}</p>
          </>
        )}
      </div>
      {!editando ? (
        <button
          type="button"
          onClick={() => setEditando(true)}
          aria-label="Editar nombre"
        >
          <IconPencil size={16} className="text-fg-muted" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

function Stat({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="rounded-[12px] border border-border bg-surface-2 p-2.5 text-center">
      <p className="font-voice text-[18px] font-medium leading-none">{valor}</p>
      <p className="mt-1 text-[10px] text-fg-muted">{label}</p>
    </div>
  );
}

/* ── Prioridades: editable + reordenable (drag y up/down) ── */
function PrioridadesEditor({ iniciales }: { iniciales: string[] }) {
  const [items, setItems] = useState<string[]>(iniciales);
  const [, startTransition] = useTransition();
  const dragIndex = useRef<number | null>(null);

  function persist(next: string[]) {
    startTransition(async () => {
      try {
        await actualizarPerfil({ prioridades: next });
      } catch {
        /* la revalidación restaura el valor real */
      }
    });
  }

  function setText(i: number, text: string) {
    setItems((prev) => prev.map((v, idx) => (idx === i ? text : v)));
  }
  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setItems(next);
    persist(next);
  }
  function remove(i: number) {
    const next = items.filter((_, idx) => idx !== i);
    setItems(next);
    persist(next);
  }
  function add() {
    const next = [...items, ""];
    setItems(next);
  }

  return (
    <div className="mb-2.5">
      <div className="border-b border-border">
        {items.map((v, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              const from = dragIndex.current;
              dragIndex.current = null;
              if (from != null) move(from, i);
            }}
            className="flex items-center gap-2 border-t border-border py-2"
          >
            <IconGripVertical
              size={14}
              className="shrink-0 cursor-grab text-fg-muted"
              aria-hidden
            />
            <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-accent-bg text-[10px] font-medium text-accent">
              {i + 1}
            </span>
            <input
              className="min-w-0 flex-1 bg-transparent text-[13px] text-fg outline-none"
              value={v}
              placeholder="Nueva prioridad"
              onChange={(e) => setText(i, e.target.value)}
              onBlur={() => persist(items)}
            />
            <button
              type="button"
              onClick={() => move(i, i - 1)}
              disabled={i === 0}
              aria-label="Subir"
              className="text-fg-muted disabled:opacity-30"
            >
              <IconChevronUp size={15} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => move(i, i + 1)}
              disabled={i === items.length - 1}
              aria-label="Bajar"
              className="text-fg-muted disabled:opacity-30"
            >
              <IconChevronDown size={15} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Eliminar prioridad"
              className="text-fg-muted"
            >
              <IconX size={15} aria-hidden />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-border-strong py-2 text-[13px] text-fg-secondary transition-colors hover:bg-surface-2"
      >
        <IconPlus size={14} aria-hidden />
        Agregar prioridad
      </button>
    </div>
  );
}

/* ── Frase motivacional ── */
function FraseEditor({ inicial }: { inicial: string | null }) {
  const [valor, setValor] = useState(inicial ?? "");
  const [, startTransition] = useTransition();

  function guardar() {
    startTransition(async () => {
      try {
        await actualizarPerfil({ frase: valor.trim() || null });
      } catch {
        /* noop */
      }
    });
  }

  return (
    <div className="flex items-center gap-2 rounded-[10px] bg-surface-2 px-3 py-2.5">
      <input
        className="min-w-0 flex-1 bg-transparent text-[12px] text-fg-secondary italic outline-none placeholder:text-fg-muted"
        value={valor}
        placeholder="Tu frase motivacional…"
        onChange={(e) => setValor(e.target.value)}
        onBlur={guardar}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      />
      <IconPencil size={13} className="shrink-0 text-fg-muted" aria-hidden />
    </div>
  );
}

/* ── Tema (next-themes + DB) ── */
function ThemeSelector({ temaInicial }: { temaInicial: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();
  useEffect(() => setMounted(true), []);

  const activoNext = mounted
    ? theme
    : TEMAS.find((t) => t.value === temaInicial)?.next;

  function elegir(t: (typeof TEMAS)[number]) {
    setTheme(t.next);
    startTransition(async () => {
      try {
        await actualizarPerfil({ tema: t.value });
      } catch {
        /* noop */
      }
    });
  }

  return (
    <div className="flex rounded-[10px] bg-surface-2 p-0.5">
      {TEMAS.map((t) => {
        const sel = activoNext === t.next;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => elegir(t)}
            className={`flex-1 rounded-[8px] py-1.5 text-[12px] transition-colors ${
              sel ? "bg-accent font-medium text-accent-fg" : "text-fg-muted"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function NotifToggle() {
  const [on, setOn] = useState(true);
  return <Toggle checked={on} onChange={setOn} label="Notificaciones" />;
}

/* ── Cuenta: contraseña, export, logout ── */
function CuentaSection({ exportRows }: { exportRows: ExportRow[] }) {
  const [modal, setModal] = useState<"password" | "export" | null>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => setModal("password")}
        className="flex w-full items-center gap-2.5 border-t border-border py-2.5 text-left"
      >
        <IconLock size={16} className="text-fg-secondary" aria-hidden />
        <span className="flex-1 text-[13px]">Cambiar contraseña</span>
        <IconChevronRight size={14} className="text-fg-muted" aria-hidden />
      </button>

      <button
        type="button"
        onClick={() => setModal("export")}
        className="flex w-full items-center gap-2.5 border-t border-border py-2.5 text-left"
      >
        <IconDownload size={16} className="text-fg-secondary" aria-hidden />
        <span className="flex-1 text-[13px]">Exportar mis datos</span>
        <IconChevronRight size={14} className="text-fg-muted" aria-hidden />
      </button>

      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 border-t border-b border-border py-2.5 text-left"
        >
          <IconLogout size={16} className="text-danger" aria-hidden />
          <span className="flex-1 text-[13px] text-danger">Cerrar sesión</span>
        </button>
      </form>

      {modal === "password" ? (
        <PasswordModal onClose={() => setModal(null)} />
      ) : null}
      {modal === "export" ? (
        <ExportModal rows={exportRows} onClose={() => setModal(null)} />
      ) : null}
    </div>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (pass.length < 6) return setMsg("Mínimo 6 caracteres.");
    setMsg(null);
    startTransition(async () => {
      try {
        await cambiarPassword(pass);
        onClose();
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Error al actualizar.");
      }
    });
  }

  return (
    <Modal title="Cambiar contraseña" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <input
          type="password"
          autoComplete="new-password"
          className={inputClass}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Nueva contraseña"
        />
        {msg ? <p className="text-[12px] text-danger">{msg}</p> : null}
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="rounded-[10px] bg-accent px-3 py-2.5 text-[13px] font-medium text-accent-fg disabled:opacity-60"
        >
          {pending ? "Actualizando…" : "Actualizar contraseña"}
        </button>
      </div>
    </Modal>
  );
}

function ExportModal({
  rows,
  onClose,
}: {
  rows: ExportRow[];
  onClose: () => void;
}) {
  function descargar(tipo: "json" | "csv") {
    let content: string;
    let mime: string;
    if (tipo === "json") {
      content = JSON.stringify(rows, null, 2);
      mime = "application/json";
    } else {
      const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
      const header = "fecha,habito,valor,nota";
      const body = rows
        .map((r) =>
          [r.fecha, esc(r.habito), r.valor, esc(r.nota ?? "")].join(","),
        )
        .join("\n");
      content = `${header}\n${body}`;
      mime = "text/csv";
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prime-registros.${tipo}`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  }

  return (
    <Modal title="Exportar mis datos" onClose={onClose}>
      <p className="mb-4 text-[13px] text-fg-secondary">
        Descargá tus {rows.length} registros de hábitos.
      </p>
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => descargar("json")}
          className="flex-1 rounded-[10px] border border-border bg-surface-2 px-3 py-2.5 text-[13px] font-medium"
        >
          Descargar JSON
        </button>
        <button
          type="button"
          onClick={() => descargar("csv")}
          className="flex-1 rounded-[10px] border border-border bg-surface-2 px-3 py-2.5 text-[13px] font-medium"
        >
          Descargar CSV
        </button>
      </div>
    </Modal>
  );
}
