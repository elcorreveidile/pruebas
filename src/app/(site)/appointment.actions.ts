"use server";

import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { AppointmentSchema } from "@/lib/leads";

export interface AppointmentState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const NOTIFY = process.env.LEADS_NOTIFY_EMAIL ?? process.env.ADMIN_EMAIL;

export async function submitAppointment(
  _prev: AppointmentState,
  formData: FormData,
): Promise<AppointmentState> {
  const parsed = AppointmentSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    treatment: formData.get("treatment") ?? "",
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { error: "Revisa los datos del formulario.", fieldErrors };
  }

  const data = parsed.data;

  // Honeypot: si el campo oculto viene relleno, es un bot. Fingimos éxito.
  if (data.website) return { ok: true };

  const email = data.email ? data.email : null;

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      email,
      treatment: data.treatment || null,
      message: data.message || null,
      source: "web",
    },
  });

  // Aviso interno a la clínica.
  if (NOTIFY) {
    try {
      await sendEmail({
        to: [{ email: NOTIFY }],
        replyTo: email ? { email, name: data.name } : undefined,
        subject: `Nueva cita web · ${data.name}`,
        text: `Nueva solicitud de cita desde la web:

Nombre: ${data.name}
Teléfono: ${data.phone}
Email: ${email ?? "—"}
Tratamiento: ${data.treatment || "—"}
Mensaje: ${data.message || "—"}

Gestiónala en el panel: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/leads/${lead.id}`,
        html: `<h2 style="font-family:Arial">Nueva cita desde la web</h2>
<table style="font-family:Arial;font-size:14px">
<tr><td><b>Nombre</b></td><td>${esc(data.name)}</td></tr>
<tr><td><b>Teléfono</b></td><td>${esc(data.phone)}</td></tr>
<tr><td><b>Email</b></td><td>${esc(email ?? "—")}</td></tr>
<tr><td><b>Tratamiento</b></td><td>${esc(data.treatment || "—")}</td></tr>
<tr><td><b>Mensaje</b></td><td>${esc(data.message || "—")}</td></tr>
</table>
<p style="font-family:Arial;font-size:14px"><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/leads/${lead.id}">Abrir en el panel →</a></p>`,
      });
    } catch (err) {
      console.error("[appointment] fallo aviso interno", err);
      // No bloqueamos al usuario: el lead ya está guardado.
    }
  }

  // Autorespuesta al paciente (si dejó email).
  if (email) {
    try {
      await sendEmail({
        to: [{ email, name: data.name }],
        subject: "Hemos recibido tu solicitud · La Fábrica de Sonrisas",
        text: `Hola ${data.name},\n\nHemos recibido tu solicitud de cita y te contactaremos muy pronto. Si necesitas algo urgente, llámanos al 958 22 74 74.\n\nUn abrazo,\nLa Fábrica de Sonrisas`,
        html: `<div style="font-family:Arial;font-size:15px;color:#2b2b2b">
<p>Hola ${esc(data.name)},</p>
<p>Hemos recibido tu solicitud de cita y te contactaremos muy pronto.</p>
<p>Si necesitas algo urgente, llámanos al <b>958 22 74 74</b>.</p>
<p>Un abrazo,<br/>La Fábrica de Sonrisas 🦷</p>
</div>`,
      });
    } catch (err) {
      console.error("[appointment] fallo autorespuesta", err);
    }
  }

  return { ok: true };
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
