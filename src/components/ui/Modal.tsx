"use client";

import { IconX } from "@tabler/icons-react";
import { useEffect } from "react";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative z-10 max-h-[92dvh] w-full max-w-[420px] overflow-y-auto rounded-t-[24px] border border-border bg-surface-1 p-5 sm:rounded-[20px]">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border-strong sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[16px] font-medium">{title}</p>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <IconX size={18} className="text-fg-muted" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
