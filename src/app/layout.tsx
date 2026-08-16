import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import DemoBanner from "@/components/layout/DemoBanner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Clínica dental en ${site.city}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  // Sitio en migración: no indexar hasta que el contenido real esté listo.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <DemoBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
