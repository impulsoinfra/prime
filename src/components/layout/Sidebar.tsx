"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { UserChip } from "./UserChip";

function isActive(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export function Sidebar({
  nombre,
  email,
}: {
  nombre?: string | null;
  email?: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-surface-1 px-3 py-5 md:flex md:w-16 lg:w-[220px] lg:px-4">
      <p className="font-voice mb-6 px-1 text-[20px] leading-none">
        <span className="hidden lg:inline">prime</span>
        <span className="lg:hidden">p</span>
      </p>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              title={label}
              className={`flex items-center justify-center gap-2 rounded-[10px] px-2.5 py-2 text-[13px] transition-colors lg:justify-start ${
                active
                  ? "bg-accent-bg text-accent"
                  : "text-fg-secondary hover:bg-surface-2"
              }`}
            >
              <Icon size={18} aria-hidden />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <UserChip nombre={nombre} email={email} />
      </div>
    </aside>
  );
}
