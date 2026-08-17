import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-coral-dark">Error 404</p>
      <h1 className="mt-3 text-4xl font-bold text-ink">Página no encontrada</h1>
      <p className="mt-4 text-warm-gray">
        Lo sentimos, la página que buscas no existe o ha cambiado de dirección.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-coral px-6 py-3 font-semibold text-white transition-colors hover:bg-coral-dark"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
