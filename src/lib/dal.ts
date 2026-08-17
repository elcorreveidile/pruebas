import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

/**
 * Capa de acceso a datos (DAL): centraliza la comprobación de sesión.
 * `verifySession` es la comprobación segura (se usa en páginas/acciones del
 * panel). Redirige a /login si no hay sesión válida.
 */
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login");
  }
  return session;
});

/** Devuelve el usuario autenticado (o redirige a /login). */
export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) {
    redirect("/login");
  }
  return user;
});

/** Exige rol ADMIN; si no, redirige al dashboard. */
export const requireAdmin = cache(async () => {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") {
    redirect("/admin");
  }
  return user;
});
