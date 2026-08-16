import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Tratamiento" };

export default async function TratamientoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PageShell
      title={`Tratamiento: ${slug}`}
      intro="Página de detalle de un tratamiento. Descripción, precio, duración y FAQ se cargarán desde el contenido migrado."
    />
  );
}
