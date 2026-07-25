"use server";

import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function unirseWaitlist(
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const limpio = email.trim().toLowerCase();
  if (!EMAIL_RE.test(limpio)) {
    return { ok: false, error: "Poné un email válido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist").insert({ email: limpio });

  if (error) {
    // 23505 = unique_violation → ya estaba anotado, lo tratamos como éxito.
    if (error.code === "23505") return { ok: true };
    return { ok: false, error: "No pudimos anotarte, probá de nuevo." };
  }

  return { ok: true };
}
