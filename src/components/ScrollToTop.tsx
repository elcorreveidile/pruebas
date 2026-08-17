"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Botón flotante para volver arriba. Aparece al bajar en la página y se coloca
 * encima del botón de WhatsApp.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      className="fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-cream-deep bg-white text-coral-dark shadow-lg transition-transform hover:scale-105"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
