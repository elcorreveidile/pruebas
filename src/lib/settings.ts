import { prisma } from "@/lib/db";
import { site } from "@/lib/site";

/**
 * Ajustes del sitio editables desde el panel (tabla Setting). Si no hay valor
 * guardado, se usan los valores por defecto de `site.ts`.
 */

export interface ContactSettings {
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappHref: string;
  email: string;
  address: string;
  addressShort: string;
  mapsUrl: string;
  mapsEmbed: string;
}

export interface ScheduleRow {
  dia: string;
  horas: string;
}

const contactDefaults: ContactSettings = {
  phone: site.phone,
  phoneHref: site.phoneHref,
  whatsapp: site.whatsapp,
  whatsappHref: site.whatsappHref,
  email: site.email,
  address: site.address,
  addressShort: site.addressShort,
  mapsUrl: site.mapsUrl,
  mapsEmbed: site.mapsEmbed,
};

const scheduleDefaults: ScheduleRow[] = site.horario.map((h) => ({
  dia: h.dia,
  horas: h.horas,
}));

export async function getContactSettings(): Promise<ContactSettings> {
  const row = await prisma.setting.findUnique({ where: { key: "contact" } });
  return { ...contactDefaults, ...((row?.value as Partial<ContactSettings>) ?? {}) };
}

export async function getSchedule(): Promise<ScheduleRow[]> {
  const row = await prisma.setting.findUnique({ where: { key: "schedule" } });
  const items = (row?.value as { items?: ScheduleRow[] } | null)?.items;
  return Array.isArray(items) && items.length ? items : scheduleDefaults;
}

/** Deriva `tel:` a partir de un teléfono con espacios (asume España +34). */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.startsWith("34") ? `tel:+${digits}` : `tel:+34${digits}`;
}

/** Deriva el enlace de WhatsApp a partir del número. */
export function toWhatsappHref(number: string): string {
  const digits = number.replace(/[^\d]/g, "");
  return `https://wa.me/${digits.startsWith("34") ? digits : "34" + digits}`;
}
