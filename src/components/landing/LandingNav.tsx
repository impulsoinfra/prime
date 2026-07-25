"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PrimeMark } from "./PrimeMark";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={scrolled ? "scrolled" : undefined}>
      <span className="logo">
        <PrimeMark size={26} />
        prime
      </span>
      <div className="nav-links">
        <a href="#producto">Producto</a>
        <a href="#como-funciona">Cómo funciona</a>
        <Link href="/signup" className="nav-cta">
          Empezar
        </Link>
      </div>
    </nav>
  );
}
