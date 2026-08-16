import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactoPage() {
  return (
    <PageShell
      title="Contacto"
      intro="Datos de contacto y ubicación de la clínica. El formulario de contacto y el mapa se añadirán en la migración."
    >
      <dl className="space-y-2 text-sm text-warm-gray">
        <div>
          <dt className="inline font-semibold text-charcoal">Ciudad: </dt>
          <dd className="inline">{site.city}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-charcoal">Teléfono: </dt>
          <dd className="inline">{site.phone || "por definir"}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-charcoal">Email: </dt>
          <dd className="inline">{site.email || "por definir"}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-charcoal">Dirección: </dt>
          <dd className="inline">{site.address || "por definir"}</dd>
        </div>
      </dl>
    </PageShell>
  );
}
