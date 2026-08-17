"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Contact,
  Newspaper,
  FileText,
  Image as ImageIcon,
  Settings,
  Users,
} from "lucide-react";
import { clsx } from "clsx";

export interface NavEntry {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  adminOnly?: boolean;
  soon?: boolean;
}

const ICONS = {
  dashboard: LayoutDashboard,
  leads: CalendarClock,
  clients: Contact,
  blog: Newspaper,
  pages: FileText,
  media: ImageIcon,
  settings: Settings,
  users: Users,
};

export const NAV: NavEntry[] = [
  { href: "/admin", label: "Panel", icon: "dashboard" },
  { href: "/admin/leads", label: "Citas", icon: "leads" },
  { href: "/admin/clients", label: "Clientes", icon: "clients" },
  { href: "/admin/blog", label: "Blog", icon: "blog" },
  { href: "/admin/pages", label: "Páginas", icon: "pages" },
  { href: "/admin/media", label: "Medios", icon: "media" },
  { href: "/admin/settings", label: "Ajustes", icon: "settings" },
  { href: "/admin/users", label: "Usuarios", icon: "users", adminOnly: true },
];

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV.filter((e) => !e.adminOnly || isAdmin).map((e) => {
        const Icon = ICONS[e.icon];
        const active =
          e.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(e.href);
        return (
          <Link
            key={e.href}
            href={e.soon ? "#" : e.href}
            aria-disabled={e.soon}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-coral text-white"
                : "text-slate hover:bg-cream-deep/60",
              e.soon && "pointer-events-none opacity-45",
            )}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span>{e.label}</span>
            {e.soon && (
              <span className="ml-auto rounded-full bg-cream-deep px-1.5 py-0.5 text-[10px] font-semibold uppercase text-warm-gray">
                pronto
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
