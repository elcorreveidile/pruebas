"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";

const ClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  phone: z.string().trim().max(30).optional(),
  email: z.union([z.email(), z.literal("")]).optional(),
  interest: z.string().trim().max(120).optional(),
  consentMarketing: z.union([z.literal("on"), z.null()]).optional(),
});

export interface ClientFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function saveClient(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  await getCurrentUser();

  const parsed = ClientSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || "",
    interest: formData.get("interest") || undefined,
    consentMarketing: formData.get("consentMarketing"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Revisa los datos.", fieldErrors };
  }

  const d = parsed.data;
  const consent = d.consentMarketing === "on";
  const email = d.email ? d.email : null;

  let clientId = d.id;
  if (d.id) {
    const current = await prisma.client.findUnique({ where: { id: d.id } });
    await prisma.client.update({
      where: { id: d.id },
      data: {
        name: d.name,
        phone: d.phone || null,
        email,
        interest: d.interest || null,
        consentMarketing: consent,
        // Sella la fecha de consentimiento al concederlo por primera vez.
        consentAt: consent ? current?.consentAt ?? new Date() : null,
      },
    });
  } else {
    const created = await prisma.client.create({
      data: {
        name: d.name,
        phone: d.phone || null,
        email,
        interest: d.interest || null,
        source: "manual",
        consentMarketing: consent,
        consentAt: consent ? new Date() : null,
      },
    });
    clientId = created.id;
  }

  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${clientId}`);
}

export async function deleteClient(formData: FormData) {
  await getCurrentUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.client.delete({ where: { id } });
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

export async function addClientNote(formData: FormData) {
  const user = await getCurrentUser();
  const clientId = String(formData.get("clientId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!clientId || !body) return;
  await prisma.clientNote.create({ data: { clientId, body, authorId: user.id } });
  revalidatePath(`/admin/clients/${clientId}`);
}

/** Convierte una cita/lead en cliente y las deja enlazadas. */
export async function convertLeadToClient(formData: FormData) {
  const user = await getCurrentUser();
  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) return;

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return;

  // Si ya estaba convertida, ve directa al cliente.
  if (lead.clientId) redirect(`/admin/clients/${lead.clientId}`);

  const client = await prisma.client.create({
    data: {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      interest: lead.treatment,
      source: "lead",
      notes: {
        create: {
          authorId: user.id,
          body: `Cliente creado desde la cita recibida el ${lead.createdAt.toLocaleDateString(
            "es-ES",
          )}.`,
        },
      },
      leads: { connect: { id: lead.id } },
    },
  });

  // Marca la cita como cerrada (ya gestionada).
  await prisma.lead.update({ where: { id: leadId }, data: { status: "CLOSED" } });

  revalidatePath("/admin/clients");
  revalidatePath("/admin/leads");
  redirect(`/admin/clients/${client.id}`);
}
