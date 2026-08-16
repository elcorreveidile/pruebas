import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Tratamientos" };

export default function TratamientosPage() {
  return (
    <PageShell
      title="Tratamientos"
      intro="Catálogo de tratamientos de la clínica. Cada tratamiento tendrá su propia página en /tratamientos/[slug]."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {["Odontología general", "Ortodoncia", "Implantes", "Estética dental", "Periodoncia", "Odontopediatría"].map(
          (t) => (
            <li
              key={t}
              className="rounded-xl border border-cream-dark bg-white/60 px-4 py-3 text-sm font-medium text-coral-dark"
            >
              {t}
            </li>
          ),
        )}
      </ul>
    </PageShell>
  );
}
