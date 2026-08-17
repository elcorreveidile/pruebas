"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { requestMagicLink } from "@/lib/auth";
import { deleteSession } from "@/lib/session";

const EmailSchema = z.object({
  email: z.email({ error: "Introduce un email válido." }),
});

export interface LoginState {
  error?: string;
  sent?: boolean;
  email?: string;
}

export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = EmailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Introduce un email válido." };
  }

  try {
    await requestMagicLink(parsed.data.email);
  } catch (err) {
    console.error("[login] error enviando magic link", err);
    return { error: "No se pudo enviar el enlace. Inténtalo de nuevo." };
  }

  // Respuesta genérica: no revela si el email está dado de alta.
  return { sent: true, email: parsed.data.email };
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
