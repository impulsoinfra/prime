"use client";

import { IconLogout } from "@tabler/icons-react";
import { signOut } from "@/actions/auth";
import { iniciales, nombreVisible } from "@/lib/user";

export function UserChip({
  nombre,
  email,
}: {
  nombre?: string | null;
  email?: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--fill-control)] text-[11px] font-medium text-fg-secondary">
        {iniciales(nombre, email)}
      </span>
      <span className="hidden min-w-0 flex-1 truncate text-[12px] text-fg-secondary lg:inline">
        {nombreVisible(nombre, email)}
      </span>
      <form action={signOut} className="hidden lg:block">
        <button
          type="submit"
          aria-label="Cerrar sesión"
          className="flex size-7 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg"
        >
          <IconLogout size={16} aria-hidden />
        </button>
      </form>
    </div>
  );
}
