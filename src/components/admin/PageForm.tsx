"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePage, type PageFormState } from "@/app/admin/pages/actions";
import RichTextEditor from "./RichTextEditor";

export interface PageFormData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  seoDescription: string;
  body: string; // HTML
}

const initial: PageFormState = {};

export default function PageForm({ page }: { page: PageFormData }) {
  const [state, action, pending] = useActionState(savePage, initial);
  const [status, setStatus] = useState<PageFormData["status"]>(page.status);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <input type="hidden" name="id" value={page.id} />

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate">
            Título <span className="text-coral">*</span>
          </label>
          <input name="title" defaultValue={page.title} required className="input text-lg font-semibold" />
          {state.fieldErrors?.title && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.title}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate">Contenido</label>
          <RichTextEditor initialHTML={page.body} />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-cream-deep bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate">Estado</p>
          <div className="flex gap-2">
            {(["DRAFT", "PUBLISHED"] as const).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                className={
                  "flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors " +
                  (status === s ? "bg-slate text-white" : "border border-cream-deep bg-white text-slate hover:bg-cream-deep/50")
                }
              >
                {s === "DRAFT" ? "Oculta" : "Visible"}
              </button>
            ))}
          </div>
          <input type="hidden" name="status" value={status} />

          <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full rounded-xl bg-coral px-4 py-2.5 text-sm font-bold text-white hover:bg-coral-dark disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar cambios"}
          </button>
          <div className="mt-2 flex items-center justify-between">
            <Link href="/admin/pages" className="text-xs text-warm-gray hover:text-coral-dark">
              ← Volver
            </Link>
            {page.status === "PUBLISHED" && (
              <Link href={`/${page.slug}`} target="_blank" className="text-xs text-warm-gray hover:text-coral-dark">
                Ver ↗
              </Link>
            )}
          </div>
          {state.saved && <p className="mt-2 text-xs font-semibold text-sage">✓ Cambios guardados</p>}
          {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
        </div>

        <div className="rounded-2xl border border-cream-deep bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate">Detalles</p>
          <Labeled label="URL">
            <input value={`/${page.slug}`} disabled className="input opacity-70" />
            <span className="mt-1 block text-[11px] text-warm-gray">La URL no se cambia para no romper enlaces.</span>
          </Labeled>
          <Labeled label="Extracto / resumen">
            <textarea name="excerpt" defaultValue={page.excerpt} rows={3} className="input" />
          </Labeled>
        </div>

        <div className="rounded-2xl border border-cream-deep bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate">SEO</p>
          <Labeled label="Título SEO">
            <input name="seoTitle" defaultValue={page.seoTitle} className="input" placeholder="Por defecto, el título" />
          </Labeled>
          <Labeled label="Descripción SEO">
            <textarea name="seoDescription" defaultValue={page.seoDescription} rows={3} className="input" placeholder="Máx. 160 caracteres." />
          </Labeled>
        </div>
      </aside>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--cream-deep); background: #fff; padding: 0.55rem 0.8rem; font-size: 0.875rem; color: var(--ink); outline: none; }
        .input:focus { border-color: var(--coral); box-shadow: 0 0 0 3px color-mix(in srgb, var(--coral) 18%, transparent); }
      `}</style>
    </form>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-warm-gray">{label}</span>
      {children}
    </label>
  );
}
