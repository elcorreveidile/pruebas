import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import ComposeEmail, { type ClientOption } from "@/components/admin/ComposeEmail";

export const metadata: Metadata = { title: "Nuevo correo" };
export const dynamic = "force-dynamic";

export default async function NewEmailPage() {
  const clients = await prisma.client.findMany({
    where: { email: { not: null } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, consentMarketing: true },
  });

  const options: ClientOption[] = clients.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email as string,
    consentMarketing: c.consentMarketing,
  }));

  return (
    <div>
      <Link
        href="/admin/emails"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a correos
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-ink">Nuevo correo</h1>
      <ComposeEmail clients={options} />
    </div>
  );
}
