"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

const SEQ_COLORS = ["#D85A30", "#7F77DD", "#1D9E75", "#BA7517"];

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

export function PrimeSequence() {
  const rowRef = useRef<HTMLDivElement>(null);

  const cells = useMemo(() => {
    let colorIndex = 0;
    return Array.from({ length: 30 }, (_, i) => {
      const n = i + 1;
      const prime = isPrime(n);
      const color = prime
        ? SEQ_COLORS[colorIndex++ % SEQ_COLORS.length]
        : undefined;
      return { n, prime, color };
    });
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const primeCells = Array.from(
      row.querySelectorAll<HTMLElement>(".seq-cell.is-prime"),
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          primeCells.forEach((cell, i) => {
            setTimeout(() => {
              cell.classList.add("pulse");
              setTimeout(() => cell.classList.remove("pulse"), 400);
            }, i * 140);
          });
          io.disconnect();
        });
      },
      { threshold: 0.5 },
    );
    io.observe(row);
    return () => io.disconnect();
  }, []);

  return (
    <div className="sequence-row" ref={rowRef}>
      {cells.map((c) => (
        <div
          key={c.n}
          className={c.prime ? "seq-cell is-prime" : "seq-cell"}
          style={
            c.color ? ({ "--seq-color": c.color } as CSSProperties) : undefined
          }
        >
          {c.n}
        </div>
      ))}
    </div>
  );
}
