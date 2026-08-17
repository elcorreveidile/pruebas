import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/PageHero";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import ContactSection from "@/components/ContactSection";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  const description =
    post.seoDescription ||
    post.excerpt?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    site.description;
  return { title: post.seoTitle || post.title, description };
}

function formatDate(d?: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero
        title={post.title}
        eyebrow={formatDate(post.publishedAt) || "Blog"}
      />
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
