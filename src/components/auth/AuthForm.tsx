"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/actions/auth";

type Mode = "login" | "signup";

export function AuthForm({
  mode,
  message,
}: {
  mode: Mode;
  message?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-[18px] font-medium">
          {mode === "login" ? "Entrar a tu cuenta" : "Crear tu cuenta"}
        </p>
        <p className="text-[13px] text-fg-secondary">
          {mode === "login"
            ? "Organizá tu día y seguí tu progreso."
            : "Empezá a medir tu progreso hacia tu prime."}
        </p>
      </div>

      {message ? (
        <p className="rounded-[10px] bg-accent-bg px-3 py-2 text-[12px] text-accent">
          {message}
        </p>
      ) : null}

      {mode === "signup" ? (
        <Field label="Nombre" htmlFor="nombre">
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            placeholder="Juan Pérez"
            className={inputClass}
          />
        </Field>
      ) : null}

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vos@ejemplo.com"
          className={inputClass}
        />
      </Field>

      <Field label="Contraseña" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>

      {state?.error ? (
        <p className="text-[12px] text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-full rounded-[10px] bg-accent px-3 py-2.5 text-[13px] font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending
          ? "Un momento…"
          : mode === "login"
            ? "Entrar"
            : "Crear cuenta"}
      </button>

      <p className="text-center text-[12px] text-fg-secondary">
        {mode === "login" ? (
          <>
            ¿No tenés cuenta?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Registrate
            </Link>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Entrá
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-[10px] border border-border bg-surface-1 px-3 py-2.5 text-[13px] text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-accent";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-[12px] text-fg-secondary">{label}</span>
      {children}
    </label>
  );
}
