import type { Metadata } from "next";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getContactSettings, getSchedule } from "@/lib/settings";
import { saveSettings } from "./actions";

export const metadata: Metadata = { title: "Ajustes" };
export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [contact, schedule, sp] = await Promise.all([
    getContactSettings(),
    getSchedule(),
    searchParams,
  ]);

  // Filas del horario + 2 vacías para poder añadir.
  const rows = [...schedule, { dia: "", horas: "" }, { dia: "", horas: "" }];

  return (
    <div className="max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Ajustes del sitio</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Datos de contacto y horario que se muestran en toda la web.
        </p>
      </header>

      {sp.saved && (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-sage-light/40 px-4 py-2.5 text-sm font-semibold text-slate">
          <CheckCircle2 className="h-4 w-4 text-sage" /> Ajustes guardados y aplicados en la web.
        </p>
      )}
      {sp.error && (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
          <AlertCircle className="h-4 w-4" /> Revisa los datos: algún campo no es válido.
        </p>
      )}

      <form action={saveSettings} className="space-y-6">
        <fieldset className="rounded-2xl border border-cream-deep bg-white p-6">
          <legend className="px-1 text-sm font-bold uppercase tracking-wide text-warm-gray">Contacto</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Teléfono" name="phone" defaultValue={contact.phone} />
            <Field label="WhatsApp (número)" name="whatsapp" defaultValue={contact.whatsapp} />
            <Field label="Email" name="email" type="email" defaultValue={contact.email} />
            <Field label="Dirección corta (pie)" name="addressShort" defaultValue={contact.addressShort} />
            <div className="sm:col-span-2">
              <Field label="Dirección completa" name="address" defaultValue={contact.address} />
            </div>
            <div className="sm:col-span-2">
              <Field label="URL de Google Maps (enlace)" name="mapsUrl" defaultValue={contact.mapsUrl} />
            </div>
            <div className="sm:col-span-2">
              <Field label="URL del mapa embebido (iframe)" name="mapsEmbed" defaultValue={contact.mapsEmbed} />
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-cream-deep bg-white p-6">
          <legend className="px-1 text-sm font-bold uppercase tracking-wide text-warm-gray">Horario</legend>
          <p className="mt-1 text-xs text-warm-gray">Deja una fila en blanco para eliminarla.</p>
          <div className="mt-3 space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <input name="dia" defaultValue={r.dia} placeholder="Días (ej. Lunes y miércoles)" className="input" />
                <input name="horas" defaultValue={r.horas} placeholder="Horas (ej. 9:30 – 18:30)" className="input" />
              </div>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="rounded-xl bg-coral px-6 py-2.5 text-sm font-bold text-white hover:bg-coral-dark">
          Guardar ajustes
        </button>
      </form>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--cream-deep); background: #fff; padding: 0.55rem 0.8rem; font-size: 0.875rem; color: var(--ink); outline: none; }
        .input:focus { border-color: var(--coral); box-shadow: 0 0 0 3px color-mix(in srgb, var(--coral) 18%, transparent); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className="input" />
    </label>
  );
}
