"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  submitAppointment,
  type AppointmentState,
} from "@/app/(site)/appointment.actions";

const initial: AppointmentState = {};

export default function AppointmentForm({
  treatments = [],
}: {
  treatments?: string[];
}) {
  const [state, action, pending] = useActionState(submitAppointment, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-sage-light bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sage" />
        <h3 className="mt-3 text-xl font-bold text-ink">¡Solicitud enviada!</h3>
        <p className="mt-2 text-sm text-warm-gray">
          Gracias por confiar en nosotros. Te contactaremos muy pronto para
          confirmar tu cita.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-2xl border border-cream-deep bg-white p-6 sm:p-8"
    >
      <h3 className="text-xl font-bold text-ink">Pide tu cita</h3>
      <p className="mt-1 text-sm text-warm-gray">
        Déjanos tus datos y te llamamos. Sin compromiso.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Nombre y apellidos" error={state.fieldErrors?.name} required>
          <input
            name="name"
            required
            autoComplete="name"
            className="input"
            placeholder="Tu nombre"
          />
        </Field>

        <Field label="Teléfono" error={state.fieldErrors?.phone} required>
          <input
            name="phone"
            required
            inputMode="tel"
            autoComplete="tel"
            className="input"
            placeholder="600 000 000"
          />
        </Field>

        <Field label="Email (opcional)" error={state.fieldErrors?.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="tu@email.com"
          />
        </Field>

        <Field label="Tratamiento de interés">
          <select name="treatment" className="input" defaultValue="">
            <option value="">Consulta general</option>
            {treatments.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Mensaje (opcional)">
            <textarea
              name="message"
              rows={3}
              className="input resize-y"
              placeholder="Cuéntanos qué necesitas…"
            />
          </Field>
        </div>
      </div>

      {/* Honeypot anti-spam: oculto para humanos */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {state.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-xl bg-coral px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-coral-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Enviando…" : "Solicitar cita"}
      </button>
      <p className="mt-3 text-xs text-warm-gray">
        Al enviar aceptas nuestra{" "}
        <a href="/politica-de-privacidad" className="underline">
          política de privacidad
        </a>
        .
      </p>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--cream-deep);
          background: #fff;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: var(--ink);
          outline: none;
        }
        .input:focus {
          border-color: var(--coral);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--coral) 20%, transparent);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate">
        {label}
        {required && <span className="text-coral"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
