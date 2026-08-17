import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Mail } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Correos" };
export const dynamic = "force-dynamic";

export default async function EmailsPage() {
  const emails = await prisma.emailMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { recipients: true } },
    },
  });

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Correos</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Envía comunicaciones con la imagen de la clínica a clientes y proveedores.
          </p>
        </div>
        <Link
          href="/admin/emails/new"
          className="inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark"
        >
          <Plus className="h-4 w-4" /> Nuevo correo
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-cream-deep bg-white">
        {emails.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Mail className="mx-auto h-8 w-8 text-warm-gray/60" />
            <p className="mt-2 text-sm text-warm-gray">
              Aún no has enviado ningún correo.{" "}
              <Link href="/admin/emails/new" className="font-semibold text-coral-dark hover:underline">
                Redactar el primero
              </Link>
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-cream-deep">
            {emails.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/emails/${e.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-cream-deep/30">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate">{e.subject}</p>
                    <p className="truncate text-xs text-warm-gray">
                      {e._count.recipients} destinatario{e._count.recipients === 1 ? "" : "s"}
                      {e.author?.name ? ` · ${e.author.name}` : ""}
                    </p>
                  </div>
                  <span
                    className={
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold " +
                      (e.status === "SENT" ? "bg-sage-light/50 text-slate" : "bg-cream-deep text-warm-gray")
                    }
                  >
                    {e.status === "SENT" ? "Enviado" : "Borrador"}
                  </span>
                  <time className="shrink-0 text-xs text-warm-gray">
                    {(e.sentAt ?? e.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
