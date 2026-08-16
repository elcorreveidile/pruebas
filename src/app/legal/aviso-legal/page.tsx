import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Aviso legal" };

export default function AvisoLegalPage() {
  return (
    <PageShell
      title="Aviso legal"
      intro="Texto del aviso legal pendiente de trasladar desde el sitio original (titular, NIF, datos registrales)."
    />
  );
}
