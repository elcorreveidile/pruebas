"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { nav, site } from "@/lib/site";

export default function Header() {
  const [openMobile, setOpenMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-cream-deep/70 bg-white/95 backdrop-blur">
      <div
        className={
          "mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-8 transition-all duration-300 " +
          (scrolled ? "py-3" : "py-8")
        }
      >
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={site.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/logo.png"
            alt={site.name}
            className={"w-auto transition-all duration-300 " + (scrolled ? "h-11" : "h-[72px]")}
            width={160}
            height={72}
          />
        </Link>

        {/* Navegación de escritorio */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.cta ? (
              <Link
                key={item.href}
                href={item.href}
                className="ml-2 rounded-full bg-coral px-5 py-2 text-[13px] font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-coral-dark"
              >
                {item.label}
              </Link>
            ) : item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-bold uppercase tracking-wide text-coral transition-colors hover:text-coral-dark"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 min-w-60 rounded-2xl border border-cream-deep bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block rounded-lg px-3 py-2 text-sm text-slate transition-colors hover:bg-cream-deep hover:text-coral-dark"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-[13px] font-bold uppercase tracking-wide text-coral transition-colors hover:text-coral-dark"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Botón menú móvil */}
        <button
          type="button"
          onClick={() => setOpenMobile((v) => !v)}
          className="rounded-lg p-2 text-slate lg:hidden"
          aria-label="Abrir menú"
          aria-expanded={openMobile}
        >
          {openMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menú móvil desplegado */}
      {openMobile && (
        <div className="border-t border-cream-deep bg-cream lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3">
            {nav.map((item) => (
              <div key={item.label} className="py-1">
                <Link
                  href={item.href}
                  onClick={() => setOpenMobile(false)}
                  className={
                    item.cta
                      ? "block rounded-full bg-coral px-4 py-2 text-center font-semibold text-white"
                      : "block py-2 font-semibold text-slate"
                  }
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-cream-deep pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setOpenMobile(false)}
                        className="block py-1.5 text-sm text-warm-gray"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
