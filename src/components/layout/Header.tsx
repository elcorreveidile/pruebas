import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cream-dark bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-coral-dark">
          {site.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-warm-gray transition-colors hover:text-coral-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
