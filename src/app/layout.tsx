import type { Metadata } from "next";
import { Montserrat, Nunito_Sans, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
});

// Tipografía de titulares del sitio original (Divi): Roboto Slab.
const robotoSlab = Roboto_Slab({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Clínica dental en ${site.city} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.name,
    title: `Clínica dental en ${site.city} | ${site.name}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Clínica dental en ${site.city} | ${site.name}`,
    description: site.description,
  },
  // Reconstrucción de migración: mantener sin indexar mientras no sea la web productiva.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${nunito.variable} ${robotoSlab.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
