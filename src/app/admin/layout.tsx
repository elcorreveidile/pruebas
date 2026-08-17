import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { site } from "@/lib/site";
import Sidebar from "@/components/admin/Sidebar";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-cream-deep/30">
      <div className="mx-auto flex max-w-[1400px] gap-0">
        {/* Barra lateral */}
        <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-cream-deep bg-white px-4 py-5">
          <Link href="/admin" className="px-2">
            <span className="block text-base font-bold leading-tight text-coral-dark">
              {site.shortName}
            </span>
            <span className="text-xs text-warm-gray">Administración</span>
          </Link>

          <div className="mt-6 flex-1">
            <Sidebar isAdmin={isAdmin} />
          </div>

          <div className="border-t border-cream-deep pt-3">
            <div className="px-3 pb-2">
              <p className="truncate text-sm font-semibold text-slate">
                {user.name ?? "Usuario"}
              </p>
              <p className="truncate text-xs text-warm-gray">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-sage-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate">
                {isAdmin ? "Admin" : "Editor"}
              </span>
            </div>
            <LogoutButton />
            <Link
              href="/"
              target="_blank"
              className="mt-1 block px-3 py-1.5 text-xs text-warm-gray hover:text-coral-dark"
            >
              Ver el sitio ↗
            </Link>
          </div>
        </aside>

        {/* Contenido */}
        <main className="min-w-0 flex-1 px-6 py-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
