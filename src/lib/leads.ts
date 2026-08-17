import { z } from "zod";
import type { LeadStatus } from "@prisma/client";

/** Etiquetas legibles de los estados de una cita/lead. */
export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "Nueva",
  CONTACTED: "Contactada",
  CLOSED: "Cerrada",
};

/** Clases de color por estado (para badges). */
export const LEAD_STATUS_CLASS: Record<LeadStatus, string> = {
  NEW: "bg-coral/15 text-coral-dark",
  CONTACTED: "bg-teal/15 text-teal",
  CLOSED: "bg-cream-deep text-warm-gray",
};

export const LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "CLOSED"];

/**
 * Validación del formulario público de cita.
 * Incluye un honeypot ("website") anti-spam: si viene relleno, se descarta.
 */
export const AppointmentSchema = z.object({
  name: z.string().trim().min(2, "Indícanos tu nombre."),
  phone: z
    .string()
    .trim()
    .min(6, "Indícanos un teléfono de contacto.")
    .max(30, "Teléfono demasiado largo."),
  email: z.union([z.email(), z.literal("")]).optional(),
  treatment: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export type AppointmentInput = z.infer<typeof AppointmentSchema>;
