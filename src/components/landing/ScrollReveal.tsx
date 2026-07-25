"use client";

import { useEffect } from "react";

/** Observa todos los `.reveal` de la landing y les agrega `.in-view` al entrar en viewport. */
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".landing .reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
