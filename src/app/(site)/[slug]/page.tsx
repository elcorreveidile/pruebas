import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import ContactSection from "@/components/ContactSection";
import { getContentPageSlugs, getPublicPage } from "@/lib/pages";
import { site } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getContentPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPage(slug);
  if (!page) return {};
  const description =
    page.seoDescription ||
    page.excerpt?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    site.description;
  return { title: page.seoTitle || page.title, description };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPublicPage(slug);
  if (!page) notFound();

  const eyebrow =
    page.kind === "TREATMENT"
      ? `Tratamientos · ${site.city}`
      : `Clínica dental · ${site.city}`;

  return (
    <>
      <PageHero title={page.title} eyebrow={eyebrow} />
      <article className="py-4 pb-8">
        <BlockRenderer blocks={page.blocks} />
      </article>

      <ContactSection />
    </>
  );
}
