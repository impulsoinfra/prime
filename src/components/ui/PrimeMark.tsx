/**
 * Isotipo oficial de Prime: el "pico" (triángulo) con un punto de color en la cima.
 * Geometría de logo/prime-mark.svg. El triángulo usa `currentColor` para adaptarse
 * al tema (tinta sobre claro, papel sobre oscuro); el punto es coral de marca.
 * El punto solo conviene a partir de ~24px; usar withDot={false} en tamaños chicos.
 */
export function PrimeMark({
  size = 32,
  withDot = true,
  dotColor = "#D85A30",
  className,
}: {
  size?: number;
  withDot?: boolean;
  dotColor?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden
    >
      <polygon points="24,78 76,78 50,18" fill="currentColor" />
      {withDot ? <circle cx="50" cy="9" r="5" fill={dotColor} /> : null}
    </svg>
  );
}
