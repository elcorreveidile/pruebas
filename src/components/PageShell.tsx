export default function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold text-charcoal sm:text-4xl">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-warm-gray">{intro}</p>}
      <div className="mt-8">{children}</div>
      <p className="mt-12 rounded-xl border border-cream-dark bg-cream-dark/40 px-4 py-3 text-xs text-warm-gray">
        Página de estructura (scaffold). El contenido definitivo se importará
        desde el sitio WordPress original durante la migración.
      </p>
    </section>
  );
}
