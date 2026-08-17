"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { toTelHref, toWhatsappHref } from "@/lib/settings";

const ContactSchema = z.object({
  phone: z.string().trim().min(1),
  whatsapp: z.string().trim().min(1),
  email: z.email(),
  address: z.string().trim().min(1),
  addressShort: z.string().trim().min(1),
  mapsUrl: z.string().trim().url(),
  mapsEmbed: z.string().trim().url(),
});

export async function saveSettings(formData: FormData) {
  await getCurrentUser();

  const parsed = ContactSchema.safeParse({
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    address: formData.get("address"),
    addressShort: formData.get("addressShort"),
    mapsUrl: formData.get("mapsUrl"),
    mapsEmbed: formData.get("mapsEmbed"),
  });

  if (!parsed.success) {
    redirect("/admin/settings?error=1");
  }

  const c = parsed.data;
  const contact = {
    ...c,
    phoneHref: toTelHref(c.phone),
    whatsappHref: toWhatsappHref(c.whatsapp),
  };

  // Horario: filas paralelas dia[]/horas[].
  const dias = formData.getAll("dia").map(String);
  const horasList = formData.getAll("horas").map(String);
  const items = dias
    .map((dia, i) => ({ dia: dia.trim(), horas: (horasList[i] ?? "").trim() }))
    .filter((r) => r.dia && r.horas);

  await prisma.$transaction([
    prisma.setting.upsert({
      where: { key: "contact" },
      update: { value: contact },
      create: { key: "contact", value: contact },
    }),
    prisma.setting.upsert({
      where: { key: "schedule" },
      update: { value: { items } },
      create: { key: "schedule", value: { items } },
    }),
  ]);

  // El contacto/horario aparece en todo el sitio: revalida todo el layout.
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}
