import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Download, Search, ShieldCheck } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Clientes" };
export const dynamic = "force-dynamic";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const where: Prisma.ClientWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { notes: true, leads: true } } },
    }),
    prisma.client.count(),
  ]);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Clientes</h1>
          <p className="mt-1 text-sm text-warm-gray">
            {total} contacto{total === 1 ? "" : "s"} en tu base de datos.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/clients/export"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-xl border border-cream-deep bg-white px-4 py-2 text-sm font-semibold text-slate hover:bg-cream-deep/50"
          >
            <Download className="h-4 w-4" /> Exportar
          </Link>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark"
          >
            <Plus className="h-4 w-4" /> Nuevo cliente
          </Link>
        </div>
      </header>

      <form className="mb-4 flex max-w-md items-center gap-2 rounded-xl border border-cream-deep bg-white px-3 py-2">
        <Search className="h-4 w-4 text-warm-gray" />
        <input
          name="q"
          defaultValue={query}
          placeholder="Buscar por nombre, teléfono o email…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </form>

      <div className="overflow-hidden rounded-2xl border border-cream-deep bg-white">
        {clients.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-warm-gray">
            {query ? "Sin resultados para tu búsqueda." : "Aún no hay clientes."}{" "}
            {!query && (
              <Link href="/admin/clients/new" className="font-semibold text-coral-dark hover:underline">
                Crear el primero
              </Link>
            )}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-cream-deep bg-cream-deep/30 text-xs uppercase tracking-wide text-warm-gray">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nombre</th>
                  <th className="px-5 py-3 font-semibold">Contacto</th>
                  <th className="px-5 py-3 font-semibold">Interés</th>
                  <th className="px-5 py-3 font-semibold">Consent.</th>
                  <th className="px-5 py-3 font-semibold">Alta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-deep">
                {clients.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-cream-deep/30">
                    <td className="px-5 py-3">
                      <Link href={`/admin/clients/${c.id}`} className="font-semibold text-slate hover:text-coral-dark">
                        {c.name}
                      </Link>
                      {c._count.leads > 0 && (
                        <span className="ml-2 text-xs text-warm-gray">· {c._count.leads} cita(s)</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-warm-gray">
                      <div>{c.phone ?? "—"}</div>
                      {c.email && <div className="text-xs">{c.email}</div>}
                    </td>
                    <td className="px-5 py-3 text-warm-gray">{c.interest ?? "—"}</td>
                    <td className="px-5 py-3">
                      {c.consentMarketing ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage">
                          <ShieldCheck className="h-3.5 w-3.5" /> Sí
                        </span>
                      ) : (
                        <span className="text-xs text-warm-gray">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-warm-gray">
                      {c.createdAt.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}
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
