"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/actions/auth";
import { inputClass } from "@/components/ui/form";

type Mode = "login" | "signup";

export function AuthForm({
  mode,
  message,
}: {
  mode: Mode;
  message?: string;
}) {
  const esLogin = mode === "login";
  const action = esLogin ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col">
      <h1 className="font-voice text-[24px] font-medium leading-none">
        {esLogin ? "Bienvenido de nuevo" : "Creá tu cuenta"}
      </h1>
      <p className="mt-2 mb-7 text-[14px] text-fg-secondary">
        {esLogin
          ? "Organizá tu día y seguí tu progreso."
          : "Empezá a medir tu progreso hacia tu prime."}
      </p>

      {message ? (
        <p className="mb-4 rounded-[10px] bg-accent-bg px-3 py-2 text-[12px] text-accent">
          {message}
        </p>
      ) : null}

      {!esLogin ? (
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
          placeholder="nombre@email.com"
          className={inputClass}
        />
      </Field>

      <Field label="Contraseña" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={esLogin ? "current-password" : "new-password"}
          placeholder="••••••••"
          className={inputClass}
        />
      </Field>

      {state?.error ? (
        <p className="mb-4 text-[12px] text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[10px] bg-accent px-3 py-3 text-[14px] font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Un momento…" : esLogin ? "Entrar" : "Crear cuenta"}
      </button>

      <p className="mt-4 text-center text-[13px] text-fg-secondary">
        {esLogin ? (
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
    <label htmlFor={htmlFor} className="mb-[18px] block">
      <span className="mb-1.5 block text-[13px] text-fg-secondary">{label}</span>
      {children}
    </label>
  );
}
