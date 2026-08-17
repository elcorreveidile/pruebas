import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, Trash2, ShieldCheck, CalendarClock } from "lucide-react";
import { prisma } from "@/lib/db";
import ClientForm from "@/components/admin/ClientForm";
import { LEAD_STATUS_LABEL, LEAD_STATUS_CLASS } from "@/lib/leads";
import { addClientNote, deleteClient } from "../actions";

export const metadata: Metadata = { title: "Ficha de cliente" };
export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, email: true } } },
      },
      leads: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/clients"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a clientes
      </Link>

      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-ink">{client.name}</h1>
        {client.consentMarketing && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sage-light/50 px-2.5 py-1 text-xs font-semibold text-slate">
            <ShieldCheck className="h-3.5 w-3.5" /> Consiente marketing
          </span>
        )}
      </div>
      <p className="mb-5 text-sm text-warm-gray">
        Alta el {client.createdAt.toLocaleDateString("es-ES", { dateStyle: "long" })}
        {client.consentAt &&
          ` · consentimiento ${client.consentAt.toLocaleDateString("es-ES")}`}
        {client.source === "lead" && " · origen: cita web"}
      </p>

      <ClientForm
        cancelHref="/admin/clients"
        client={{
          id: client.id,
          name: client.name,
          phone: client.phone ?? "",
          email: client.email ?? "",
          interest: client.interest ?? "",
          consentMarketing: client.consentMarketing,
        }}
      />

      {/* Citas asociadas */}
      {client.leads.length > 0 && (
        <section className="mt-6 rounded-2xl border border-cream-deep bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <CalendarClock className="h-5 w-5 text-coral-dark" /> Citas asociadas
          </h2>
          <ul className="mt-3 divide-y divide-cream-deep">
            {client.leads.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className="flex items-center gap-3 py-2.5 hover:text-coral-dark">
                  <span className="flex-1 text-sm text-slate">
                    {l.treatment ?? "Consulta general"}
                  </span>
                  <span className={"rounded-full px-2.5 py-0.5 text-xs font-semibold " + LEAD_STATUS_CLASS[l.status]}>
                    {LEAD_STATUS_LABEL[l.status]}
                  </span>
                  <time className="text-xs text-warm-gray">
                    {l.createdAt.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Notas */}
      <section className="mt-6 rounded-2xl border border-cream-deep bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <MessageSquare className="h-5 w-5 text-coral-dark" /> Notas
        </h2>
        <form action={addClientNote} className="mt-3 flex gap-2">
          <input type="hidden" name="clientId" value={client.id} />
          <input
            name="body"
            required
            placeholder="Añade una nota…"
            className="flex-1 rounded-xl border border-cream-deep px-3.5 py-2 text-sm outline-none focus:border-coral"
          />
          <button type="submit" className="rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark">
            Añadir
          </button>
        </form>
        {client.notes.length > 0 && (
          <ul className="mt-4 space-y-3">
            {client.notes.map((n) => (
              <li key={n.id} className="rounded-xl bg-cream-deep/40 p-3">
                <p className="text-sm text-slate">{n.body}</p>
                <p className="mt-1 text-xs text-warm-gray">
                  {n.author?.name ?? n.author?.email ?? "Equipo"} ·{" "}
                  {n.createdAt.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form action={deleteClient} className="mt-6">
        <input type="hidden" name="id" value={client.id} />
        <button type="submit" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" /> Eliminar este cliente
        </button>
      </form>
    </div>
  );
}
