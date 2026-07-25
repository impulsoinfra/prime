"use client";

import { useState, useTransition, type FormEvent } from "react";
import { unirseWaitlist } from "@/actions/waitlist";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await unirseWaitlist(email);
      if (res.ok) {
        setMsg({ ok: true, text: "¡Listo! Te avisamos cuando abramos." });
        setEmail("");
      } else {
        setMsg({ ok: false, text: res.error ?? "Algo salió mal." });
      }
    });
  }

  return (
    <>
      <form className="email-row" onSubmit={submit}>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Tu email"
          required
        />
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Un momento…" : "Unirme"}
        </button>
      </form>
      {msg ? (
        <p
          className="email-msg"
          role="status"
          style={{ color: msg.ok ? "var(--teal)" : "var(--coral)" }}
        >
          {msg.text}
        </p>
      ) : null}
    </>
  );
}
