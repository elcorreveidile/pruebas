import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import ContactSection from "@/components/ContactSection";
import AppointmentForm from "@/components/AppointmentForm";
import { getContentPageSlugs, getPublicPage } from "@/lib/pages";
import { treatments } from "@/lib/content";
import { site } from "@/lib/site";

/** Páginas donde mostramos el formulario de solicitud de cita. */
const APPOINTMENT_SLUGS = new Set(["contacto", "primera-visita"]);

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

  const showAppointment = APPOINTMENT_SLUGS.has(slug);

  return (
    <>
      <PageHero title={page.title} eyebrow={eyebrow} />
      <article className="py-4 pb-8">
        <BlockRenderer blocks={page.blocks} />
      </article>

      {showAppointment && (
        <section id="pedir-cita" className="scroll-mt-24 bg-cream-deep/40 py-14">
          <div className="mx-auto max-w-3xl px-4">
            <AppointmentForm treatments={treatments.map((t) => t.nombre)} />
          </div>
        </section>
      )}

      <ContactSection />
    </>
  );
}
