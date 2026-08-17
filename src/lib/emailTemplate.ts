import { site } from "@/lib/site";

/**
 * Plantilla HTML corporativa para los correos de la clínica. Diseño seguro para
 * clientes de email (tablas + estilos en línea), con cabecera de marca, cuerpo
 * y pie con datos de contacto y aviso legal.
 */

export interface BrandedEmailOptions {
  /** Contenido interno (HTML del editor). */
  bodyHtml: string;
  /** Texto de preencabezado (vista previa en la bandeja). */
  preheader?: string;
  /** Datos de contacto del pie (por defecto, los del sitio). */
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    url?: string;
  };
}

const COLORS = {
  coral: "#ff7f67",
  coralDark: "#d06540",
  cream: "#fffaef",
  creamDeep: "#faf4d9",
  ink: "#1c160d",
  gray: "#6f6a5f",
};

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** Aplica estilos en línea a los elementos del cuerpo (los emails ignoran <style>). */
function styleInline(html: string): string {
  return html
    .replace(/<h1>/g, `<h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${COLORS.ink}">`)
    .replace(/<h2>/g, `<h2 style="margin:22px 0 8px;font-size:19px;line-height:1.3;color:${COLORS.ink}">`)
    .replace(/<h3>/g, `<h3 style="margin:18px 0 6px;font-size:16px;line-height:1.3;color:${COLORS.coralDark}">`)
    .replace(/<p>/g, `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#2b2b2b">`)
    .replace(/<ul>/g, `<ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.6;color:#2b2b2b">`)
    .replace(/<ol>/g, `<ol style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.6;color:#2b2b2b">`)
    .replace(/<a /g, `<a style="color:${COLORS.coralDark};text-decoration:underline" `)
    .replace(/<blockquote>/g, `<blockquote style="margin:0 0 14px;padding-left:14px;border-left:3px solid ${COLORS.coral};color:${COLORS.gray}">`);
}

export function renderBrandedEmail(opts: BrandedEmailOptions): string {
  const logo = `${site.url.replace(/\/$/, "")}/media/logo.png`;
  const phone = opts.contact?.phone ?? site.phone;
  const email = opts.contact?.email ?? site.email;
  const address = opts.contact?.address ?? site.address;
  const url = opts.contact?.url ?? site.url;
  const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const body = styleInline(opts.bodyHtml);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(site.name)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.creamDeep};font-family:Arial,Helvetica,sans-serif">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(opts.preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.creamDeep};padding:24px 12px">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${COLORS.creamDeep}">
        <!-- Cabecera -->
        <tr><td style="height:6px;background:${COLORS.coral};line-height:6px;font-size:6px">&nbsp;</td></tr>
        <tr>
          <td align="center" style="background:${COLORS.cream};padding:26px 32px 18px">
            <img src="${logo}" alt="${esc(site.name)}" width="180" style="display:block;width:180px;max-width:60%;height:auto">
          </td>
        </tr>
        <!-- Cuerpo -->
        <tr>
          <td style="padding:28px 32px 8px">
            ${body}
          </td>
        </tr>
        <!-- Pie -->
        <tr>
          <td style="background:${COLORS.creamDeep};padding:22px 32px;border-top:1px solid #efe3c4">
            <p style="margin:0 0 4px;font-size:14px;font-weight:bold;color:${COLORS.ink}">${esc(site.legalName)}</p>
            <p style="margin:0 0 2px;font-size:13px;color:${COLORS.gray}">${esc(address)}</p>
            <p style="margin:0 0 2px;font-size:13px;color:${COLORS.gray}">Tel. ${esc(phone)} · <a href="mailto:${esc(email)}" style="color:${COLORS.coralDark};text-decoration:none">${esc(email)}</a></p>
            <p style="margin:0 0 10px;font-size:13px"><a href="${esc(url)}" style="color:${COLORS.coralDark};text-decoration:none">${esc(cleanUrl)}</a></p>
            <p style="margin:0;font-size:11px;color:${COLORS.gray};line-height:1.5">
              Recibes este correo por tu relación con ${esc(site.name)}. Tratamos tus datos conforme a nuestra
              <a href="${esc(url)}/politica-de-privacidad" style="color:${COLORS.gray}">política de privacidad</a>.
            </p>
          </td>
        </tr>
      </table>
      <p style="margin:14px 0 0;font-size:11px;color:${COLORS.gray}">© ${new Date().getFullYear()} ${esc(site.name)}</p>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Versión de texto plano sencilla a partir del HTML del cuerpo. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<li>/gi, "· ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
