"use client";

import { useActionState } from "react";
import { inviteUser, type UsersState } from "@/app/admin/users/actions";

const initial: UsersState = {};

export default function InviteUserForm() {
  const [state, action, pending] = useActionState(inviteUser, initial);

  return (
    <form action={action} className="rounded-2xl border border-cream-deep bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-slate">Invitar usuario</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
        <input name="email" type="email" required placeholder="email@ejemplo.com" className="input" />
        <input name="name" placeholder="Nombre (opcional)" className="input" />
        <select name="role" defaultValue="EDITOR" className="input">
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Invitar"}
        </button>
      </div>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="mt-2 text-sm font-semibold text-sage">{state.ok}</p>}

      <style>{`
        .input { border-radius: 0.75rem; border: 1px solid var(--cream-deep); background: #fff; padding: 0.55rem 0.8rem; font-size: 0.875rem; color: var(--ink); outline: none; }
        .input:focus { border-color: var(--coral); box-shadow: 0 0 0 3px color-mix(in srgb, var(--coral) 18%, transparent); }
      `}</style>
    </form>
  );
}
