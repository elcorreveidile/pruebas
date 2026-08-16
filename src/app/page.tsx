import Link from "next/link";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="animate-fade-in-up text-sm font-semibold uppercase tracking-widest text-sage-dark">
          Clínica dental · {site.city}
        </p>
        <h1 className="animate-fade-in-up mt-4 text-4xl font-bold text-charcoal sm:text-5xl">
          {site.name}
        </h1>
        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-warm-gray">
          {site.description} Cuidamos tu sonrisa con un trato cercano y la última
          tecnología.
        </p>
        <div className="animate-fade-in-up mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/cita"
            className="rounded-full bg-coral px-8 py-3 font-semibold text-white transition-colors hover:bg-coral-dark"
          >
            Pedir cita
          </Link>
          <Link
            href="/tratamientos"
            className="rounded-full border border-coral px-8 py-3 font-semibold text-coral-dark transition-colors hover:bg-cream-dark"
          >
            Ver tratamientos
          </Link>
        </div>
      </section>

      {/* Bloques de servicios (placeholder) */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-cream-dark bg-white/60 p-6"
            >
              <h2 className="text-xl font-bold text-coral-dark">{s.title}</h2>
              <p className="mt-2 text-sm text-warm-gray">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-warm-gray">
          Contenido de ejemplo — se sustituirá por el real durante la migración.
        </p>
      </section>
    </>
  );
}

const SERVICIOS = [
  {
    title: "Odontología general",
    text: "Revisiones, limpiezas, empastes y prevención para toda la familia.",
  },
  {
    title: "Ortodoncia",
    text: "Brackets y ortodoncia invisible para alinear tu sonrisa a cualquier edad.",
  },
  {
    title: "Implantes",
    text: "Reposición de piezas perdidas con implantes de última generación.",
  },
  {
    title: "Estética dental",
    text: "Blanqueamiento, carillas y diseño digital de sonrisa.",
  },
  {
    title: "Periodoncia",
    text: "Tratamiento de encías y mantenimiento de la salud periodontal.",
  },
  {
    title: "Odontopediatría",
    text: "Cuidado dental adaptado a los más pequeños de la casa.",
  },
];
