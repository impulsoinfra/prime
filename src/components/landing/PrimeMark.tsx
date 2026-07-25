/** Isotipo de Prime: el "pico" (triángulo) con un punto de color en la cima.
 *  El punto solo se muestra a partir de ~64px; usar withDot={false} en tamaños chicos. */
export function PrimeMark({
  size = 32,
  withDot = true,
}: {
  size?: number;
  withDot?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path d="M16 9 L27 27 H5 Z" fill="var(--paper)" />
      {withDot ? <circle cx="16" cy="5" r="2.6" fill="var(--coral)" /> : null}
    </svg>
  );
}
