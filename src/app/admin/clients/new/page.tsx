import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ClientForm from "@/components/admin/ClientForm";

export const metadata: Metadata = { title: "Nuevo cliente" };

export default function NewClientPage() {
  return (
    <div>
      <Link
        href="/admin/clients"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a clientes
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-ink">Nuevo cliente</h1>
      <ClientForm
        cancelHref="/admin/clients"
        client={{ name: "", phone: "", email: "", interest: "", consentMarketing: false }}
      />
    </div>
  );
}
