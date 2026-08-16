import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Consejos de salud bucodental, novedades y curiosidades del equipo de La Fábrica de Sonrisas en Granada.",
};

function formatDate(d?: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogPage() {
  const posts = getPosts();
  return (
    <>
      <PageHero
        title="Blog"
        eyebrow="La Fábrica de Sonrisas"
        subtitle="Consejos de salud bucodental, novedades y curiosidades para cuidar tu sonrisa."
      />
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-cream-deep bg-white p-6 transition-shadow hover:shadow-md"
            >
              <time className="text-xs font-semibold uppercase tracking-wide text-coral-dark">
                {formatDate(p.date)}
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
      </section>
      <ContactSection />
    </>
  );
}
