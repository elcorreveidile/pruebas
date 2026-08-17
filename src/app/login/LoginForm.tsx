"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

const initial: LoginState = {};

export default function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState(sendMagicLink, {
    ...initial,
    error: initialError,
  });

  if (state.sent) {
    return (
      <div className="rounded-2xl border border-cream-deep bg-white p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-2xl">
          ✉️
        </div>
        <h2 className="text-lg font-bold text-ink">Revisa tu correo</h2>
        <p className="mt-2 text-sm text-warm-gray">
          Si <strong>{state.email}</strong> tiene acceso, te hemos enviado un
          enlace para entrar. Caduca en 15 minutos.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-semibold text-slate"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
          className="w-full rounded-xl border border-cream-deep bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-coral px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar enlace de acceso"}
      </button>
      <p className="text-center text-xs text-warm-gray">
        Te enviaremos un enlace mágico. Sin contraseñas.
      </p>
    </form>
  );
}
