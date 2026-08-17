import { site } from "@/lib/site";

export default function PageHero({
  title,
  eyebrow,
  subtitle,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-cream-deep bg-cream-deep/40">
      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
        <p className="animate-fade-in-up text-sm font-semibold uppercase tracking-widest text-coral-dark">
          {eyebrow ?? `Clínica dental · ${site.city}`}
        </p>
        <h1 className="animate-fade-in-up mt-3 text-3xl font-bold text-ink sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="animate-fade-in-up mx-auto mt-4 max-w-2xl text-lg text-warm-gray">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
