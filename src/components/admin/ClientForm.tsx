"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveClient, type ClientFormState } from "@/app/admin/clients/actions";

export interface ClientFormData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  consentMarketing: boolean;
}

const initial: ClientFormState = {};

export default function ClientForm({
  client,
  cancelHref,
}: {
  client: ClientFormData;
  cancelHref: string;
}) {
  const [state, action, pending] = useActionState(saveClient, initial);

  return (
    <form action={action} className="max-w-xl space-y-4 rounded-2xl border border-cream-deep bg-white p-6">
      {client.id && <input type="hidden" name="id" value={client.id} />}

      <Field label="Nombre y apellidos" error={state.fieldErrors?.name} required>
        <input name="name" defaultValue={client.name} required className="input" placeholder="Nombre del cliente" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono" error={state.fieldErrors?.phone}>
          <input name="phone" defaultValue={client.phone} inputMode="tel" className="input" placeholder="600 000 000" />
        </Field>
        <Field label="Email" error={state.fieldErrors?.email}>
          <input name="email" type="email" defaultValue={client.email} className="input" placeholder="cliente@email.com" />
        </Field>
      </div>

      <Field label="Tratamiento de interés">
        <input name="interest" defaultValue={client.interest} className="input" placeholder="Ortodoncia, implantes…" />
      </Field>

      <label className="flex items-start gap-3 rounded-xl bg-cream-deep/40 p-3">
        <input
          type="checkbox"
          name="consentMarketing"
          defaultChecked={client.consentMarketing}
          className="mt-0.5 h-4 w-4 accent-coral"
        />
        <span className="text-sm text-slate">
          Ha dado su <strong>consentimiento</strong> para recibir comunicaciones
          comerciales (RGPD). Se registrará la fecha.
        </span>
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-coral px-5 py-2.5 text-sm font-bold text-white hover:bg-coral-dark disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
        <Link href={cancelHref} className="text-sm text-warm-gray hover:text-coral-dark">
          Cancelar
        </Link>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--cream-deep);
          background: #fff;
          padding: 0.55rem 0.8rem;
          font-size: 0.875rem;
          color: var(--ink);
          outline: none;
        }
        .input:focus { border-color: var(--coral); box-shadow: 0 0 0 3px color-mix(in srgb, var(--coral) 18%, transparent); }
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
