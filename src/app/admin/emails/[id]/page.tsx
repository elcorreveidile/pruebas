import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { renderBrandedEmail } from "@/lib/emailTemplate";
import { deleteEmail } from "../actions";

export const metadata: Metadata = { title: "Correo" };
export const dynamic = "force-dynamic";

export default async function EmailDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const email = await prisma.emailMessage.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
      recipients: { orderBy: { email: "asc" } },
    },
  });
  if (!email) notFound();

  const sentCount = email.recipients.filter((r) => r.status === "sent").length;
  const failed = email.recipients.filter((r) => r.status === "failed").length;
  const preview = renderBrandedEmail({ bodyHtml: email.bodyHtml, preheader: email.subject });

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/emails" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark">
        <ArrowLeft className="h-4 w-4" /> Volver a correos
      </Link>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{email.subject}</h1>
          <p className="mt-1 text-sm text-warm-gray">
            {email.status === "SENT" && email.sentAt
              ? `Enviado el ${email.sentAt.toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" })}`
              : "Borrador"}
            {email.author?.name ? ` · por ${email.author.name}` : ""}
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-sage">
            <CheckCircle2 className="h-4 w-4" /> {sentCount} enviados
          </span>
          {failed > 0 && (
            <span className="inline-flex items-center gap-1 font-semibold text-red-600">
              <XCircle className="h-4 w-4" /> {failed} fallidos
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Destinatarios */}
        <div className="rounded-2xl border border-cream-deep bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate">
            Destinatarios ({email.recipients.length})
          </p>
          <ul className="max-h-[60vh] space-y-1 overflow-y-auto">
            {email.recipients.map((r) => (
              <li key={r.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm">
                {r.status === "sent" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-sage" />
                ) : r.status === "failed" ? (
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                ) : (
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-cream-deep" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-slate">{r.name ?? r.email}</span>
                  {r.name && <span className="block truncate text-xs text-warm-gray">{r.email}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Vista previa del correo enviado */}
        <div>
          <p className="mb-2 text-sm font-semibold text-slate">Contenido enviado</p>
          <iframe
            title="Correo enviado"
            srcDoc={preview}
            className="h-[70vh] w-full rounded-2xl border border-cream-deep bg-white"
          />
        </div>
      </div>

      <form action={deleteEmail} className="mt-6">
        <input type="hidden" name="id" value={email.id} />
        <button type="submit" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" /> Eliminar del historial
        </button>
      </form>
    </div>
  );
}
