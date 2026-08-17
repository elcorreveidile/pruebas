"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { LEAD_STATUSES } from "@/lib/leads";

const StatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]),
});

export async function updateLeadStatus(formData: FormData) {
  await getCurrentUser();
  const parsed = StatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await prisma.lead.update({
    where: { id: parsed.data.id },
    // status validado contra el enum de Prisma
    data: { status: parsed.data.status as never },
  });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${parsed.data.id}`);
  revalidatePath("/admin");
}

export async function addLeadNote(formData: FormData) {
  const user = await getCurrentUser();
  const leadId = String(formData.get("leadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!leadId || !body) return;

  await prisma.leadNote.create({
    data: { leadId, body, authorId: user.id },
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(formData: FormData) {
  await getCurrentUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
