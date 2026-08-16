import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <PageShell
      title="Política de privacidad"
      intro="Política de privacidad y tratamiento de datos pendiente de trasladar desde el sitio original."
    />
  );
}
