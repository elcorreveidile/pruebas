import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  return (
    <PageShell
      title="Política de cookies"
      intro="Política de cookies pendiente de trasladar desde el sitio original."
    />
  );
}
