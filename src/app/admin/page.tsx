import Link from "next/link";
import { CalendarClock, Newspaper, Contact, Inbox } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { LEAD_STATUS_LABEL } from "@/lib/leads";

export const dynamic = "force-dynamic";

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  const [newLeads, monthLeads, clients, published, recent] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth() } } }),
    prisma.client.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Citas nuevas", value: newLeads, icon: Inbox, href: "/admin/leads?status=NEW", accent: "text-coral-dark bg-coral/10" },
    { label: "Citas este mes", value: monthLeads, icon: CalendarClock, href: "/admin/leads", accent: "text-teal bg-teal/10" },
    { label: "Clientes", value: clients, icon: Contact, href: "/admin/clients", accent: "text-sage bg-sage-light/40" },
    { label: "Entradas publicadas", value: published, icon: Newspaper, href: "/admin/blog", accent: "text-slate bg-cream-deep" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-ink">
          Hola{user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-warm-gray">
          Resumen de la clínica y accesos rápidos.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-2xl border border-cream-deep bg-white p-5 transition-shadow hover:shadow-md"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.accent}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-3xl font-bold text-ink">{s.value}</p>
              <p className="text-sm text-warm-gray">{s.label}</p>
            </Link>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Últimas citas</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-coral-dark hover:underline">
            Ver todas
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-cream-deep bg-white">
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-warm-gray">
              Aún no hay solicitudes de cita.
            </p>
          ) : (
            <ul className="divide-y divide-cream-deep">
              {recent.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-cream-deep/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate">{l.name}</p>
                      <p className="truncate text-xs text-warm-gray">
                        {l.phone}
                        {l.treatment ? ` · ${l.treatment}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-cream-deep px-2.5 py-1 text-[11px] font-semibold text-slate">
                      {LEAD_STATUS_LABEL[l.status]}
                    </span>
                    <time className="shrink-0 text-xs text-warm-gray">
                      {l.createdAt.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
