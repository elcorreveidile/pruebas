/**
 * Configuración global del sitio.
 * Datos reales importados desde https://www.lafabricadesonrisasgranada.com
 * (clínica dental La Fábrica de Sonrisas, Granada — WordPress/Divi).
 */
export const site = {
  name: "La Fábrica de Sonrisas",
  shortName: "La Fábrica de Sonrisas",
  legalName: "La Fábrica de Sonrisas HBA, S.L.P.",
  city: "Granada",
  claim: "Donde tu sonrisa cobra vida",
  description:
    "En nuestra clínica dental en Granada, cuidamos tu salud bucodental con un trato cercano y tratamientos personalizados. ¡Implantes, ortodoncia y más!",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lafabricadesonrisasgranada.com",

  // Contacto real
  phone: "958 22 74 74",
  phoneHref: "tel:+34958227474",
  whatsapp: "663 82 89 30",
  whatsappHref: "https://wa.me/34663828930",
  email: "lafabricadesonrisasgranada@gmail.com",
  address: "Calle Molinos, 34 · Barrio del Realejo · Granada",
  addressShort: "Calle Molinos, 34 — Realejo, Granada",
  mapsUrl: "https://maps.app.goo.gl/iuHbUAT3Pq1nhSHt9",
  mapsEmbed:
    "https://www.google.com/maps?q=Calle+Molinos+34+Granada&output=embed",

  // Reserva online (Optimydent)
  bookingUrl:
    "https://lafabricadesonrisasgranada.optimydent.com/cita-online?iframe=1&k=JDJ5JDEwJGtKU2g0VFF2SUdmLjR6ekxPc1RCVS4uZTJnM2p3VXdrakx5V1RXSy55Q0FPQllVSHFaR2Jh",

  horario: [
    { dia: "Lunes y miércoles", horas: "9:30 – 18:30" },
    { dia: "Martes y jueves", horas: "9:30 – 13:30 / 16:00 – 20:00" },
    { dia: "Viernes", horas: "9:30 – 13:30" },
    { dia: "Sábados y domingos", horas: "Cerrado" },
  ],
} as const;

export type NavChild = { label: string; href: string };
export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  cta?: boolean;
};

/** Menú principal, fiel al del sitio WordPress original. */
export const nav: NavItem[] = [
  {
    label: "Servicios",
    href: "/#servicios",
    children: [
      { label: "Ortodoncia", href: "/ortodoncia-en-granada" },
      { label: "Ortodoncia invisible", href: "/ortodoncia-invisible-en-granada" },
      { label: "Odontología general", href: "/odontologia-general" },
      { label: "Extracción", href: "/extraccion-dental-en-granada" },
      { label: "Implantología", href: "/implantes-dentales-en-granada" },
      { label: "Autotrasplante dental", href: "/autotrasplante-dental-en-granada" },
      { label: "Periodoncia", href: "/periodoncia-en-granada" },
      { label: "Estética dental", href: "/estetica-dental-en-granada" },
      { label: "Diseño digital de sonrisa", href: "/diseno-digital-de-sonrisa-en-granada" },
      { label: "Expansión del maxilar", href: "/expansion-del-maxilar-en-granada" },
      { label: "Microimplantes dentales", href: "/microimplantes-dentales-en-granada" },
      { label: "Cirugía periodontal", href: "/cirugia-periodontal-en-granada" },
      { label: "Carillas dentales", href: "/carillas-dentales-en-granada" },
    ],
  },
  {
    label: "La fábrica",
    href: "/quienes-somos",
    children: [
      { label: "Fabriequipo", href: "/el-equipo" },
      { label: "Solidarios y sostenibles", href: "/solidarios-y-sostenibles" },
    ],
  },
  { label: "El método BHA", href: "/#bha" },
  { label: "Blog", href: "/blog" },
  { label: "La fábrica en los medios", href: "/medios" },
  { label: "Contacto", href: "/contacto" },
  { label: "Cita online", href: "/primera-visita", cta: true },
];

/** Enlaces legales (pie de página). */
export const legalNav: NavChild[] = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
];
