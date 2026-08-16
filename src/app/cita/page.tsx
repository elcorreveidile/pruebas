import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Pedir cita" };

export default function CitaPage() {
  return (
    <PageShell
      title="Pedir cita"
      intro="Aquí irá el formulario de solicitud de cita (nombre, teléfono, motivo, fecha preferida) conectado al backend de leads."
    >
      <div className="rounded-xl border border-dashed border-coral-light bg-white/60 p-6 text-sm text-warm-gray">
        Formulario de cita pendiente de implementar. En el sitio de referencia
        (la-fabrica-de-sonrisas) se conecta a Supabase mediante <code>/api/leads</code>.
      </div>
    </PageShell>
  );
}
