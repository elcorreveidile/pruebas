import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/PageHero";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import ContactSection from "@/components/ContactSection";
import { getPost, getPosts } from "@/lib/content";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const description =
    post.excerpt?.replace(/\s+/g, " ").trim().slice(0, 160) || site.description;
  return { title: post.title, description };
}

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero title={post.title} eyebrow={formatDate(post.date) || "Blog"} />
      <article className="py-8 pb-16">
        <div className="mx-auto mb-6 max-w-3xl px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-coral-dark hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>
        </div>
        <BlockRenderer blocks={post.blocks} />
      </article>
      <ContactSection />
    </>
  );
}
