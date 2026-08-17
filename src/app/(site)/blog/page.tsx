import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Consejos de salud bucodental, novedades y curiosidades del equipo de La Fábrica de Sonrisas en Granada.",
};

// Revalidación incremental: el blog se actualiza al publicar desde el panel.
export const revalidate = 60;

function formatDate(d?: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageHero
        title="Blog"
        eyebrow="La Fábrica de Sonrisas"
        subtitle="Consejos de salud bucodental, novedades y curiosidades para cuidar tu sonrisa."
      />
      <section className="mx-auto max-w-5xl px-4 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-warm-gray">
            Aún no hay entradas publicadas.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col rounded-2xl border border-cream-deep bg-white p-6 transition-shadow hover:shadow-md"
              >
                <time className="text-xs font-semibold uppercase tracking-wide text-coral-dark">
                  {formatDate(p.publishedAt)}
                </time>
                <h2 className="mt-2 text-xl font-bold text-ink">{p.title}</h2>
                <p className="mt-3 flex-1 text-sm text-warm-gray">{p.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-coral-dark">
                  Leer más
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
      <ContactSection />
    </>
  );
}
