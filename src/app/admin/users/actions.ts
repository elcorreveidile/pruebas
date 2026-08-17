"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { requestMagicLink } from "@/lib/auth";

const InviteSchema = z.object({
  email: z.email("Email no válido."),
  name: z.string().trim().max(120).optional(),
  role: z.enum(["ADMIN", "EDITOR"]),
});

export interface UsersState {
  error?: string;
  ok?: string;
}

export async function inviteUser(
  _prev: UsersState,
  formData: FormData,
): Promise<UsersState> {
  await requireAdmin();

  const parsed = InviteSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") || undefined,
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe un usuario con ese email." };
  }

  await prisma.user.create({
    data: { email, name: parsed.data.name || null, role: parsed.data.role },
  });

  // Envía un enlace mágico para que pueda entrar directamente.
  try {
    await requestMagicLink(email);
  } catch (err) {
    console.error("[users] no se pudo enviar la invitación", err);
  }

  revalidatePath("/admin/users");
  return { ok: `Usuario ${email} creado. Se le ha enviado un enlace de acceso.` };
}

export async function toggleUserActive(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || id === admin.id) return; // no desactivarse a sí mismo
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return;
  await prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
  revalidatePath("/admin/users");
}

export async function changeUserRole(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!id || (role !== "ADMIN" && role !== "EDITOR")) return;
  if (id === admin.id) return; // no cambiarse el rol a sí mismo
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || id === admin.id) return; // no borrarse a sí mismo
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
