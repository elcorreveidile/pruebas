import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Mail, MessageSquare, Trash2, UserPlus, UserCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  LEAD_STATUS_LABEL,
  LEAD_STATUS_CLASS,
  LEAD_STATUSES,
} from "@/lib/leads";
import { updateLeadStatus, addLeadNote, deleteLead } from "../actions";
import { convertLeadToClient } from "@/app/admin/clients/actions";

export const metadata: Metadata = { title: "Detalle de cita" };
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, email: true } } },
      },
    },
  });
  if (!lead) notFound();

  const created = lead.createdAt.toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/leads"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a citas
      </Link>

      <div className="rounded-2xl border border-cream-deep bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">{lead.name}</h1>
            <p className="mt-1 text-sm text-warm-gray">Recibida el {created}</p>
          </div>
          <span className={"rounded-full px-3 py-1 text-sm font-semibold " + LEAD_STATUS_CLASS[lead.status]}>
            {LEAD_STATUS_LABEL[lead.status]}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-coral-dark" />
            <div>
              <dt className="text-xs uppercase text-warm-gray">Teléfono</dt>
              <dd>
                <a href={`tel:${lead.phone}`} className="font-semibold text-slate hover:underline">
                  {lead.phone}
                </a>
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-coral-dark" />
            <div>
              <dt className="text-xs uppercase text-warm-gray">Email</dt>
              <dd className="font-semibold text-slate">
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase text-warm-gray">Tratamiento de interés</dt>
            <dd className="font-semibold text-slate">{lead.treatment ?? "Consulta general"}</dd>
          </div>
          {lead.message && (
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase text-warm-gray">Mensaje</dt>
              <dd className="mt-1 whitespace-pre-wrap rounded-xl bg-cream-deep/40 p-3 text-sm text-slate">
                {lead.message}
              </dd>
            </div>
          )}
        </dl>

        {/* Cambio de estado */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-cream-deep pt-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate">Estado</p>
            <div className="flex flex-wrap gap-2">
              {LEAD_STATUSES.map((s) => (
                <form key={s} action={updateLeadStatus}>
                  <input type="hidden" name="id" value={lead.id} />
                  <input type="hidden" name="status" value={s} />
                  <button
                    type="submit"
                    disabled={s === lead.status}
                    className={
                      "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors " +
                      (s === lead.status
                        ? "bg-slate text-white"
                        : "border border-cream-deep bg-white text-slate hover:bg-cream-deep/50")
                    }
                  >
                    {LEAD_STATUS_LABEL[s]}
                  </button>
                </form>
              ))}
            </div>
          </div>

          {lead.clientId ? (
            <Link
              href={`/admin/clients/${lead.clientId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-sage-light bg-sage-light/30 px-4 py-2 text-sm font-semibold text-slate hover:bg-sage-light/50"
            >
              <UserCheck className="h-4 w-4" /> Ver ficha de cliente
            </Link>
          ) : (
            <form action={convertLeadToClient}>
              <input type="hidden" name="leadId" value={lead.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-bold text-white hover:opacity-90"
              >
                <UserPlus className="h-4 w-4" /> Convertir en cliente
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Notas internas */}
      <section className="mt-6 rounded-2xl border border-cream-deep bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
          <MessageSquare className="h-5 w-5 text-coral-dark" /> Notas de seguimiento
        </h2>

        <form action={addLeadNote} className="mt-3 flex gap-2">
          <input type="hidden" name="leadId" value={lead.id} />
          <input
            name="body"
            required
            placeholder="Añade una nota (ej. llamado, cita agendada…)"
            className="flex-1 rounded-xl border border-cream-deep px-3.5 py-2 text-sm outline-none focus:border-coral"
          />
          <button
            type="submit"
            className="rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark"
          >
            Añadir
          </button>
        </form>

        {lead.notes.length > 0 && (
          <ul className="mt-4 space-y-3">
            {lead.notes.map((n) => (
              <li key={n.id} className="rounded-xl bg-cream-deep/40 p-3">
                <p className="text-sm text-slate">{n.body}</p>
                <p className="mt-1 text-xs text-warm-gray">
                  {n.author?.name ?? n.author?.email ?? "Equipo"} ·{" "}
                  {n.createdAt.toLocaleString("es-ES", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Zona peligrosa */}
      <form action={deleteLead} className="mt-6">
        <input type="hidden" name="id" value={lead.id} />
        <button
          type="submit"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" /> Eliminar esta cita
        </button>
      </form>
    </div>
  );
}
