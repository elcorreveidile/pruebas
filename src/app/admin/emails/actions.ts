"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { sendEmail } from "@/lib/email";
import { renderBrandedEmail, htmlToPlainText } from "@/lib/emailTemplate";
import { getContactSettings } from "@/lib/settings";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ComposeState {
  error?: string;
}

/** Extrae y valida emails de un texto libre (comas o saltos de línea). */
function parseEmails(raw: string): string[] {
  return raw
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => emailRe.test(e));
}

export async function sendCampaign(
  _prev: ComposeState,
  formData: FormData,
): Promise<ComposeState> {
  const user = await getCurrentUser();

  const subject = String(formData.get("subject") ?? "").trim();
  const bodyHtml = String(formData.get("body") ?? "").trim();
  const clientIds = formData.getAll("clientIds").map(String);
  const manual = parseEmails(String(formData.get("manualEmails") ?? ""));

  if (subject.length < 2) return { error: "Indica un asunto." };
  if (htmlToPlainText(bodyHtml).length < 2) return { error: "El correo está vacío." };

  // Destinatarios: clientes seleccionados + emails manuales, deduplicados.
  const clients = clientIds.length
    ? await prisma.client.findMany({
        where: { id: { in: clientIds }, email: { not: null } },
        select: { email: true, name: true },
      })
    : [];

  const map = new Map<string, { email: string; name: string | null }>();
  for (const c of clients) {
    if (c.email) map.set(c.email.toLowerCase(), { email: c.email, name: c.name });
  }
  for (const e of manual) {
    if (!map.has(e)) map.set(e, { email: e, name: null });
  }
  const recipients = [...map.values()];
  if (recipients.length === 0) return { error: "Añade al menos un destinatario." };

  const contact = await getContactSettings();
  const html = renderBrandedEmail({
    bodyHtml,
    preheader: subject,
    contact: {
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
    },
  });
  const text = htmlToPlainText(bodyHtml);

  // Registro del correo + destinatarios.
  const message = await prisma.emailMessage.create({
    data: {
      subject,
      bodyHtml,
      authorId: user.id,
      recipients: {
        create: recipients.map((r) => ({ email: r.email, name: r.name })),
      },
    },
    include: { recipients: true },
  });

  // Envío individual (cada destinatario recibe su propio correo, sin ver a los demás).
  for (const r of message.recipients) {
    try {
      await sendEmail({
        to: [{ email: r.email, name: r.name ?? undefined }],
        subject,
        html,
        text,
      });
      await prisma.emailRecipient.update({
        where: { id: r.id },
        data: { status: "sent" },
      });
    } catch (err) {
      await prisma.emailRecipient.update({
        where: { id: r.id },
        data: { status: "failed", error: err instanceof Error ? err.message : "error" },
      });
    }
  }

  await prisma.emailMessage.update({
    where: { id: message.id },
    data: { status: "SENT", sentAt: new Date() },
  });

  revalidatePath("/admin/emails");
  redirect(`/admin/emails/${message.id}`);
}

export async function deleteEmail(formData: FormData) {
  await getCurrentUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.emailMessage.delete({ where: { id } });
  revalidatePath("/admin/emails");
  redirect("/admin/emails");
}
