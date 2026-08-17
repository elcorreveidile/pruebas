import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

/** Minutos de validez del enlace mágico. */
const TOKEN_TTL_MIN = 15;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

/**
 * Genera un enlace mágico para el email dado y lo envía por Brevo.
 * Solo se envía si el email corresponde a un usuario activo. En cualquier caso
 * la respuesta al usuario debe ser genérica (no revelar si el email existe).
 */
export async function requestMagicLink(rawEmail: string): Promise<void> {
  const email = rawEmail.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return; // silencioso: evita enumeración

  // Invalida tokens previos del mismo email.
  await prisma.loginToken.deleteMany({ where: { email } });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MIN * 60 * 1000);
  await prisma.loginToken.create({
    data: { email, tokenHash: hashToken(token), expiresAt },
  });

  const url = `${siteUrl()}/api/auth/verify?token=${token}&email=${encodeURIComponent(
    email,
  )}`;

  await sendEmail({
    to: [{ email, name: user.name ?? undefined }],
    subject: "Tu acceso al panel · La Fábrica de Sonrisas",
    text: `Hola${user.name ? " " + user.name : ""},\n\nAccede al panel con este enlace (válido ${TOKEN_TTL_MIN} minutos):\n${url}\n\nSi no has solicitado este acceso, ignora este correo.`,
    html: magicLinkHtml(url, user.name ?? undefined),
  });
}

/**
 * Verifica el token del enlace mágico. Devuelve el usuario si es válido y
 * consume el token (un solo uso). Devuelve null si es inválido/caducado.
 */
export async function consumeMagicLink(rawEmail: string, token: string) {
  const email = rawEmail.trim().toLowerCase();
  const record = await prisma.loginToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!record || record.email !== email || record.expiresAt < new Date()) {
    return null;
  }

  // Un solo uso: elimina el token (y cualquier otro del email).
  await prisma.loginToken.deleteMany({ where: { email } });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return null;

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  return user;
}

function magicLinkHtml(url: string, name?: string): string {
  return `<!doctype html>
<html lang="es"><body style="margin:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #efe7dc">
        <tr><td style="padding:28px 32px 8px">
          <h1 style="margin:0;font-size:20px;color:#e8624a">La Fábrica de Sonrisas</h1>
          <p style="margin:16px 0 4px;font-size:15px">Hola${name ? " " + escapeHtml(name) : ""},</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.5">Pulsa el botón para acceder al panel de administración. El enlace caduca en ${TOKEN_TTL_MIN} minutos y solo puede usarse una vez.</p>
          <p style="margin:0 0 24px"><a href="${url}" style="display:inline-block;background:#e8624a;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:bold;font-size:15px">Acceder al panel</a></p>
          <p style="margin:0;font-size:12px;color:#8a8079">Si no has solicitado este acceso, puedes ignorar este correo.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
