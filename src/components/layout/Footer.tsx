import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-cream-dark bg-cream-dark/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-warm-gray">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-base font-bold text-coral-dark">{site.name}</p>
            <p className="mt-1">Clínica dental · {site.city}</p>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/legal/aviso-legal" className="hover:text-coral-dark">
              Aviso legal
            </Link>
            <Link href="/legal/privacidad" className="hover:text-coral-dark">
              Privacidad
            </Link>
            <Link href="/legal/cookies" className="hover:text-coral-dark">
              Cookies
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs">
          © {new Date().getFullYear()} {site.name}. Migración WordPress → Next.js
          en curso.
        </p>
      </div>
    </footer>
  );
}
