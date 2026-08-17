import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { legalNav, nav, site } from "@/lib/site";

export default function Footer() {
  const servicios = nav.find((n) => n.label === "Servicios")?.children ?? [];

  return (
    <footer className="mt-16 border-t border-cream-deep bg-cream-deep/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logo.png" alt={site.name} className="h-12 w-auto" width={180} height={48} />
          <p className="mt-4 text-sm text-warm-gray">
            Clínica dental de autor en {site.city}. {site.claim}.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate">Tratamientos</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            {servicios.slice(0, 7).map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-warm-gray hover:text-coral-dark">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate">La fábrica</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link href="/quienes-somos" className="text-warm-gray hover:text-coral-dark">Quiénes somos</Link></li>
            <li><Link href="/el-equipo" className="text-warm-gray hover:text-coral-dark">El equipo</Link></li>
            <li><Link href="/solidarios-y-sostenibles" className="text-warm-gray hover:text-coral-dark">Solidarios y sostenibles</Link></li>
            <li><Link href="/medios" className="text-warm-gray hover:text-coral-dark">La Fábrica en los medios</Link></li>
            <li><Link href="/blog" className="text-warm-gray hover:text-coral-dark">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate">Contacto</h3>
          <ul className="mt-3 space-y-2 text-sm text-warm-gray">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-coral-dark">
                {site.addressShort}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-coral" />
              <a href={site.phoneHref} className="hover:text-coral-dark">{site.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-coral" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-coral-dark">{site.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-deep">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-warm-gray sm:flex-row">
          <p>© {new Date().getFullYear()} {site.legalName}. Todos los derechos reservados.</p>
          <nav className="flex flex-wrap gap-4">
            {legalNav.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-coral-dark">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-cream-deep">
          <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-warm-gray">
            Desarrollado por{" "}
            <a
              href="https://www.por2duros.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-coral-dark hover:underline"
            >
              Por 2 duros
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
