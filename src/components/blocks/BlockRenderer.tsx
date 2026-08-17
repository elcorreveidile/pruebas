import Link from "next/link";
import FAQAccordion, { FaqItem } from "./FAQAccordion";
import type { Block } from "@/types";

function isInternal(href?: string | null) {
  return !!href && (href.startsWith("/") || href.startsWith("#"));
}

function CTAButton({ text, href }: { text: string; href?: string | null }) {
  const target = href || "#contacto";
  const className =
    "inline-flex items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-coral-dark";
  if (isInternal(target)) {
    return (
      <Link href={target} className={className}>
        {text}
      </Link>
    );
  }
  return (
    <a href={target} target="_blank" rel="noreferrer" className={className}>
      {text}
    </a>
  );
}

/**
 * Renderiza la secuencia de bloques migrada desde Divi.
 * Agrupa los `toggle` consecutivos en un acordeón de FAQ y descarta el
 * primer H1 (lo pinta el hero de la página).
 */
export default function BlockRenderer({
  blocks,
  dropFirstH1 = true,
}: {
  blocks: Block[];
  dropFirstH1?: boolean;
}) {
  const out: React.ReactNode[] = [];
  let faqBuffer: FaqItem[] = [];
  let droppedH1 = !dropFirstH1;

  const flushFaq = (key: string) => {
    if (faqBuffer.length) {
      out.push(<FAQAccordion key={key} items={faqBuffer} />);
      faqBuffer = [];
    }
  };

  blocks.forEach((b, i) => {
    if (b.type === "toggle") {
      faqBuffer.push({ title: b.title, content: b.content, html: b.html });
      return;
    }
    flushFaq(`faq-${i}`);

    switch (b.type) {
      case "heading": {
        if (b.level === 1 && !droppedH1) {
          droppedH1 = true;
          return;
        }
        if (b.level <= 2) {
          out.push(
            <h2 key={i} className="mt-10 text-2xl font-bold text-ink sm:text-3xl">
              {b.text}
            </h2>,
          );
        } else {
          out.push(
            <h3 key={i} className="mt-6 text-lg font-bold text-coral-dark">
              {b.text}
            </h3>,
          );
        }
        break;
      }
      case "paragraph":
        out.push(
          <p key={i} className="mt-3 leading-relaxed text-warm-gray">
            {b.text}
          </p>,
        );
        break;
      case "list":
        out.push(
          <ul key={i} className="mt-3 list-disc space-y-1 pl-5 text-warm-gray">
            {b.items.map((it, j) => (
              <li key={j}>{it}</li>
            ))}
          </ul>,
        );
        break;
      case "image":
        out.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={b.src}
            alt={b.alt || ""}
            loading="lazy"
            className="mt-6 w-full rounded-2xl border border-cream-deep object-cover"
          />,
        );
        break;
      case "blurb":
        out.push(
          <div key={i} className="mt-4 rounded-2xl border border-cream-deep bg-white p-5">
            {b.title && <h3 className="text-lg font-bold text-coral-dark">{b.title}</h3>}
            {b.desc && <p className="mt-1 text-sm text-warm-gray">{b.desc}</p>}
          </div>,
        );
        break;
      case "button":
        out.push(
          <div key={i} className="mt-6">
            <CTAButton text={b.text} href={b.href} />
          </div>,
        );
        break;
      case "video":
        if (b.src) {
          out.push(
            <div key={i} className="mt-6 aspect-video overflow-hidden rounded-2xl border border-cream-deep">
              <iframe src={b.src} title="Vídeo" className="h-full w-full" allowFullScreen />
            </div>,
          );
        }
        break;
    }
  });
  flushFaq("faq-final");

  return <div className="mx-auto max-w-3xl px-4">{out}</div>;
}
