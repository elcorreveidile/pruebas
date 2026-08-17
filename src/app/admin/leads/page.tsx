import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import type { LeadStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  LEAD_STATUS_LABEL,
  LEAD_STATUS_CLASS,
  LEAD_STATUSES,
} from "@/lib/leads";

export const metadata: Metadata = { title: "Citas" };
export const dynamic = "force-dynamic";

const FILTERS: { key: string; label: string }[] = [
  { key: "ALL", label: "Todas" },
  ...LEAD_STATUSES.map((s) => ({ key: s, label: LEAD_STATUS_LABEL[s] })),
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter =
    status && LEAD_STATUSES.includes(status as LeadStatus) ? status : "ALL";

  const where: Prisma.LeadWhereInput =
    activeFilter === "ALL" ? {} : { status: activeFilter as LeadStatus };

  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { notes: true } } },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: true }),
  ]);

  const countByStatus = Object.fromEntries(
    counts.map((c) => [c.status, c._count]),
  ) as Record<string, number>;
  const total = counts.reduce((n, c) => n + c._count, 0);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Citas</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Solicitudes recibidas desde la web.
          </p>
        </div>
        <Link
          href="/admin/leads/export"
          className="inline-flex items-center gap-2 rounded-xl border border-cream-deep bg-white px-4 py-2 text-sm font-semibold text-slate transition-colors hover:bg-cream-deep/50"
          prefetch={false}
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Link>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          const count = f.key === "ALL" ? total : countByStatus[f.key] ?? 0;
          return (
            <Link
              key={f.key}
              href={f.key === "ALL" ? "/admin/leads" : `/admin/leads?status=${f.key}`}
              className={
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors " +
                (isActive
                  ? "bg-slate text-white"
                  : "bg-white text-slate border border-cream-deep hover:bg-cream-deep/50")
              }
            >
              {f.label}
              <span className={"ml-1.5 " + (isActive ? "text-white/70" : "text-warm-gray")}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-deep bg-white">
        {leads.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-warm-gray">
            No hay citas en esta vista.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-cream-deep bg-cream-deep/30 text-xs uppercase tracking-wide text-warm-gray">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nombre</th>
                  <th className="px-5 py-3 font-semibold">Contacto</th>
                  <th className="px-5 py-3 font-semibold">Tratamiento</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-deep">
                {leads.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-cream-deep/30">
                    <td className="px-5 py-3">
                      <Link href={`/admin/leads/${l.id}`} className="font-semibold text-slate hover:text-coral-dark">
                        {l.name}
                      </Link>
                      {l._count.notes > 0 && (
                        <span className="ml-2 text-xs text-warm-gray">
                          · {l._count.notes} nota{l._count.notes > 1 ? "s" : ""}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-warm-gray">
                      <div>{l.phone}</div>
                      {l.email && <div className="text-xs">{l.email}</div>}
                    </td>
                    <td className="px-5 py-3 text-warm-gray">{l.treatment ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className={"inline-block rounded-full px-2.5 py-1 text-xs font-semibold " + LEAD_STATUS_CLASS[l.status]}>
                        {LEAD_STATUS_LABEL[l.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-warm-gray">
                      {l.createdAt.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
