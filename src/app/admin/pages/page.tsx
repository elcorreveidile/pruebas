import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, ExternalLink } from "lucide-react";
import type { PageKind } from "@prisma/client";
import { prisma } from "@/lib/db";
import { togglePagePublish } from "./actions";

export const metadata: Metadata = { title: "Páginas" };
export const dynamic = "force-dynamic";

const KIND_LABEL: Record<PageKind, string> = {
  TREATMENT: "Tratamientos",
  PAGE: "Institucionales",
  LEGAL: "Legales",
  HOME: "Portada",
};
const GROUP_ORDER: PageKind[] = ["PAGE", "TREATMENT", "LEGAL"];

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    where: { NOT: { kind: "HOME" } },
    orderBy: [{ kind: "asc" }, { order: "asc" }, { title: "asc" }],
  });

  const byKind = new Map<PageKind, typeof pages>();
  for (const p of pages) {
    const list = byKind.get(p.kind) ?? [];
    list.push(p);
    byKind.set(p.kind, list);
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Páginas</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Edita los textos y el contenido de las páginas de la web.
        </p>
      </header>

      <div className="space-y-8">
        {GROUP_ORDER.map((kind) => {
          const list = byKind.get(kind);
          if (!list?.length) return null;
          return (
            <section key={kind}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-warm-gray">
                {KIND_LABEL[kind]}
              </h2>
              <div className="overflow-hidden rounded-2xl border border-cream-deep bg-white">
                <ul className="divide-y divide-cream-deep">
                  {list.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="min-w-0 flex-1">
                        <Link href={`/admin/pages/${p.id}`} className="font-semibold text-slate hover:text-coral-dark">
                          {p.title}
                        </Link>
                        <p className="truncate text-xs text-warm-gray">/{p.slug}</p>
                      </div>
                      <span
                        className={
                          "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold " +
                          (p.status === "PUBLISHED" ? "bg-sage-light/50 text-slate" : "bg-cream-deep text-warm-gray")
                        }
                      >
                        {p.status === "PUBLISHED" ? "Visible" : "Oculta"}
                      </span>
                      <form action={togglePagePublish} className="shrink-0">
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="rounded-lg border border-cream-deep px-2.5 py-1 text-xs font-semibold text-slate hover:bg-cream-deep/50">
                          {p.status === "PUBLISHED" ? "Ocultar" : "Publicar"}
                        </button>
                      </form>
                      {p.status === "PUBLISHED" && (
                        <Link href={`/${p.slug}`} target="_blank" className="shrink-0 text-warm-gray hover:text-coral-dark" title="Ver">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                      <Link href={`/admin/pages/${p.id}`} className="shrink-0 text-warm-gray hover:text-coral-dark" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
