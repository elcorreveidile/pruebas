import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import type { ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { togglePublish } from "./actions";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = status === "DRAFT" || status === "PUBLISHED" ? status : "ALL";
  const where: Prisma.PostWhereInput =
    filter === "ALL" ? {} : { status: filter as ContentStatus };

  const posts = await prisma.post.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });

  const filters = [
    { key: "ALL", label: "Todas", href: "/admin/blog" },
    { key: "PUBLISHED", label: "Publicadas", href: "/admin/blog?status=PUBLISHED" },
    { key: "DRAFT", label: "Borradores", href: "/admin/blog?status=DRAFT" },
  ];

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Crea y gestiona las entradas del blog.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark"
        >
          <Plus className="h-4 w-4" /> Nueva entrada
        </Link>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.href}
            className={
              "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors " +
              (filter === f.key
                ? "bg-slate text-white"
                : "border border-cream-deep bg-white text-slate hover:bg-cream-deep/50")
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-deep bg-white">
        {posts.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-warm-gray">
            No hay entradas en esta vista.{" "}
            <Link href="/admin/blog/new" className="font-semibold text-coral-dark hover:underline">
              Crear la primera
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-cream-deep">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/blog/${p.id}`} className="font-semibold text-slate hover:text-coral-dark">
                    {p.title}
                  </Link>
                  <p className="truncate text-xs text-warm-gray">/blog/{p.slug}</p>
                </div>

                <span
                  className={
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold " +
                    (p.status === "PUBLISHED"
                      ? "bg-sage-light/50 text-slate"
                      : "bg-cream-deep text-warm-gray")
                  }
                >
                  {p.status === "PUBLISHED" ? "Publicada" : "Borrador"}
                </span>

                <form action={togglePublish} className="shrink-0">
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-cream-deep px-2.5 py-1 text-xs font-semibold text-slate hover:bg-cream-deep/50"
                  >
                    {p.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                  </button>
                </form>

                {p.status === "PUBLISHED" && (
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="shrink-0 text-warm-gray hover:text-coral-dark"
                    title="Ver en el sitio"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="shrink-0 text-warm-gray hover:text-coral-dark"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
