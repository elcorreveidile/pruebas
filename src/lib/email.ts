import "server-only";

/**
 * Envío de email transaccional vía Brevo (API v3).
 * Requiere BREVO_API_KEY. Si no está configurada, no lanza en desarrollo:
 * registra el email por consola para poder probar sin credenciales.
 */
const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: { email: string; name?: string };
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL ?? "no-responder@lafabricadesonrisasgranada.com";
  const senderName = process.env.BREVO_SENDER_NAME ?? "La Fábrica de Sonrisas";

  if (!apiKey) {
    // Modo desarrollo sin credenciales: log en vez de envío real.
    console.warn(
      `[email] BREVO_API_KEY no configurada. Email NO enviado a ${opts.to
        .map((t) => t.email)
        .join(", ")} — asunto: "${opts.subject}"`,
    );
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email:preview]\n${opts.text ?? opts.html}`);
    }
    return;
  }

  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: opts.to,
      subject: opts.subject,
      htmlContent: opts.html,
      textContent: opts.text,
      replyTo: opts.replyTo,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo error ${res.status}: ${body}`);
  }
}
