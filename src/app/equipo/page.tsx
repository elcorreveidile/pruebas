import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Equipo" };

export default function EquipoPage() {
  return (
    <PageShell
      title="Nuestro equipo"
      intro="Presentación del equipo de profesionales de la clínica. Fotos y biografías se importarán del sitio original."
    />
  );
}
