"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePost, type PostFormState } from "@/app/admin/blog/actions";
import RichTextEditor from "./RichTextEditor";

export interface PostFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  status: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  seoDescription: string;
  /** Contenido en HTML (lo produce el editor visual). */
  body: string;
}

const initial: PostFormState = {};

export default function PostForm({ post }: { post: PostFormData }) {
  const [state, action, pending] = useActionState(savePost, initial);
  const [status, setStatus] = useState<PostFormData["status"]>(post.status);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {post.id && <input type="hidden" name="id" value={post.id} />}

      {/* Columna principal */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate">
            Título <span className="text-coral">*</span>
          </label>
          <input
            name="title"
            defaultValue={post.title}
            required
            className="input text-lg font-semibold"
            placeholder="Título de la entrada"
          />
          {state.fieldErrors?.title && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate">
            Contenido
          </label>
          <RichTextEditor initialHTML={post.body} />
        </div>
      </div>

      {/* Columna lateral */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-cream-deep bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate">Publicación</p>
          <div className="flex gap-2">
            {(["DRAFT", "PUBLISHED"] as const).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                className={
                  "flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors " +
                  (status === s
                    ? "bg-slate text-white"
                    : "border border-cream-deep bg-white text-slate hover:bg-cream-deep/50")
                }
              >
                {s === "DRAFT" ? "Borrador" : "Publicada"}
              </button>
            ))}
          </div>
          <input type="hidden" name="status" value={status} />

          <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full rounded-xl bg-coral px-4 py-2.5 text-sm font-bold text-white hover:bg-coral-dark disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar"}
          </button>
          <Link
            href="/admin/blog"
            className="mt-2 block text-center text-xs text-warm-gray hover:text-coral-dark"
          >
            Cancelar
          </Link>
          {state.error && (
            <p className="mt-2 text-xs text-red-600">{state.error}</p>
          )}
        </div>

        <div className="rounded-2xl border border-cream-deep bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate">Detalles</p>
          <Labeled label="Slug (URL)">
            <input name="slug" defaultValue={post.slug} className="input" placeholder="se-genera-del-titulo" />
          </Labeled>
          <Labeled label="Extracto">
            <textarea name="excerpt" defaultValue={post.excerpt} rows={3} className="input" placeholder="Resumen breve para el listado." />
          </Labeled>
          <Labeled label="Imagen de portada (URL)">
            <input name="coverImage" defaultValue={post.coverImage} className="input" placeholder="/media/…" />
          </Labeled>
        </div>

        <div className="rounded-2xl border border-cream-deep bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate">SEO</p>
          <Labeled label="Título SEO">
            <input name="seoTitle" defaultValue={post.seoTitle} className="input" placeholder="Por defecto, el título" />
          </Labeled>
          <Labeled label="Descripción SEO">
            <textarea name="seoDescription" defaultValue={post.seoDescription} rows={3} className="input" placeholder="Máx. 160 caracteres." />
          </Labeled>
        </div>
      </aside>

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

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-warm-gray">
        {label}
      </span>
      {children}
    </label>
  );
}
