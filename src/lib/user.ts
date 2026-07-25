/** Iniciales para el avatar (1–2 letras) a partir del nombre o, si falta, del email. */
export function iniciales(nombre?: string | null, email?: string | null): string {
  const n = (nombre ?? "").trim();
  if (n) {
    const partes = n.split(/\s+/);
    const a = partes[0]?.[0] ?? "";
    const b = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
    return (a + b).toUpperCase();
  }
  const e = (email ?? "").trim();
  return e ? e.slice(0, 2).toUpperCase() : "?";
}

/** Nombre a mostrar: nombre si existe, si no la parte local del email. */
export function nombreVisible(nombre?: string | null, email?: string | null): string {
  const n = (nombre ?? "").trim();
  if (n) return n;
  const e = (email ?? "").trim();
  return e ? e.split("@")[0] : "Vos";
}
