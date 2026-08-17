"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Send, ShieldCheck, Eye } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { sendCampaign, type ComposeState } from "@/app/admin/emails/actions";
import { renderBrandedEmail } from "@/lib/emailTemplate";

export interface ClientOption {
  id: string;
  name: string;
  email: string;
  consentMarketing: boolean;
}

const initial: ComposeState = {};

export default function ComposeEmail({ clients }: { clients: ClientOption[] }) {
  const [state, action, pending] = useActionState(sendCampaign, initial);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [manual, setManual] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const manualCount = manual
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)).length;
  const total = selected.size + manualCount;

  const previewHtml = useMemo(
    () =>
      renderBrandedEmail({
        bodyHtml: body || '<p style="color:#9a938a">(Escribe el contenido del correo…)</p>',
        preheader: subject,
      }),
    [body, subject],
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-2">
      {/* Columna de composición */}
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate">Asunto</label>
          <input
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="input"
            placeholder="Asunto del correo"
          />
        </div>

        {/* Destinatarios */}
        <div className="rounded-2xl border border-cream-deep bg-white p-4">
          <p className="mb-2 text-sm font-semibold text-slate">
            Destinatarios <span className="text-warm-gray">({total})</span>
          </p>

          {clients.length > 0 && (
            <div className="mb-3 max-h-48 overflow-y-auto rounded-xl border border-cream-deep">
              {clients.map((c) => (
                <label key={c.id} className="flex items-center gap-2 border-b border-cream-deep/70 px-3 py-1.5 text-sm last:border-0 hover:bg-cream-deep/30">
                  <input
                    type="checkbox"
                    name="clientIds"
                    value={c.id}
                    checked={selected.has(c.id)}
                    onChange={() => toggle(c.id)}
                    className="h-4 w-4 accent-coral"
                  />
                  <span className="flex-1 truncate text-slate">{c.name}</span>
                  <span className="truncate text-xs text-warm-gray">{c.email}</span>
                  {c.consentMarketing && <ShieldCheck className="h-3.5 w-3.5 text-sage" />}
                </label>
              ))}
            </div>
          )}

          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-slate">Otros emails (proveedores, etc.)</span>
            <textarea
              name="manualEmails"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              rows={2}
              className="input"
              placeholder="proveedor@ejemplo.com, otro@ejemplo.com"
            />
          </label>
        </div>

        {/* Cuerpo */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate">Mensaje</label>
          <RichTextEditor initialHTML="" onChange={setBody} minHeight={260} />
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending || total === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-2.5 text-sm font-bold text-white hover:bg-coral-dark disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {pending ? "Enviando…" : `Enviar a ${total} destinatario${total === 1 ? "" : "s"}`}
          </button>
          <Link href="/admin/emails" className="text-sm text-warm-gray hover:text-coral-dark">
            Cancelar
          </Link>
        </div>
      </div>

      {/* Columna de vista previa */}
      <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate">
            <Eye className="h-4 w-4" /> Vista previa
          </p>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs text-warm-gray hover:text-coral-dark lg:hidden"
          >
            {showPreview ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {showPreview && (
          <iframe
            title="Vista previa del correo"
            srcDoc={previewHtml}
            className="h-[70vh] w-full rounded-2xl border border-cream-deep bg-white lg:h-[calc(100%-2rem)]"
          />
        )}
      </div>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--cream-deep); background: #fff; padding: 0.55rem 0.8rem; font-size: 0.875rem; color: var(--ink); outline: none; }
        .input:focus { border-color: var(--coral); box-shadow: 0 0 0 3px color-mix(in srgb, var(--coral) 18%, transparent); }
      `}</style>
    </form>
  );
}
