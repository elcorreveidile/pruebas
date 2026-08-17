"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

/**
 * Banner de consentimiento de cookies (RGPD), integrado por defecto.
 * El sitio no usa cookies de terceros/analítica por ahora, así que la decisión
 * solo se guarda localmente. Si en el futuro se añade analítica, se puede
 * condicionar su carga a `localStorage['cookie-consent'] === 'all'`.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* almacenamiento no disponible: no mostramos */
    }
  }, []);

  const decide = (value: "all" | "essential") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* noop */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-cream-deep bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate">
          Usamos cookies propias necesarias para el funcionamiento del sitio.
          Puedes aceptar todas o solo las esenciales. Más información en nuestra{" "}
          <Link href="/politica-de-cookies" className="font-semibold text-coral-dark underline">
            política de cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide("essential")}
            className="rounded-xl border border-cream-deep bg-white px-4 py-2 text-sm font-semibold text-slate hover:bg-cream-deep/50"
          >
            Solo esenciales
          </button>
          <button
            onClick={() => decide("all")}
            className="rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
