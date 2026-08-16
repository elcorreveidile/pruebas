/**
 * Configuración global del sitio.
 * Los datos reales (dirección, teléfono, textos) se rellenarán al migrar
 * el contenido de https://www.lafabricadesonrisasgranada.com
 */
export const site = {
  name: "La Fábrica de Sonrisas",
  shortName: "Fábrica de Sonrisas",
  city: "Granada",
  description:
    "Clínica dental en Granada. Odontología general, ortodoncia, implantes y estética dental.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lafabricadesonrisasgranada.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "34958000000",
  // TODO: rellenar con datos reales tras el scraping del sitio WordPress
  phone: "",
  email: "",
  address: "",
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Tratamientos", href: "/tratamientos" },
  { label: "Equipo", href: "/equipo" },
  { label: "Contacto", href: "/contacto" },
  { label: "Pedir cita", href: "/cita" },
];
