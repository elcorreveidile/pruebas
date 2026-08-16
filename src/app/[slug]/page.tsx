import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import ContactSection from "@/components/ContactSection";
import { getContentPages, getPage, isTreatment } from "@/lib/content";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getContentPages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  const description =
    page.excerpt?.replace(/\s+/g, " ").trim().slice(0, 160) || site.description;
  return { title: page.title, description };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page || page.slug === "pagina-de-inicio") notFound();

  const eyebrow = isTreatment(slug)
    ? `Tratamientos · ${site.city}`
    : `Clínica dental · ${site.city}`;

  return (
    <>
      <PageHero title={page.title} eyebrow={eyebrow} />
      <article className="py-4 pb-16">
        <BlockRenderer blocks={page.blocks} />
      </article>
      <ContactSection />
    </>
  );
}
