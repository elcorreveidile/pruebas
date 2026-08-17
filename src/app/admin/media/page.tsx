import type { Metadata } from "next";
import { Upload, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import CopyButton from "@/components/admin/CopyButton";
import { uploadMedia, deleteMedia } from "./actions";

export const metadata: Metadata = { title: "Medios" };
export const dynamic = "force-dynamic";

function formatSize(bytes?: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  const usingBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Medios</h1>
        <p className="mt-1 text-sm text-warm-gray">
          Sube imágenes y copia su URL para usarlas en páginas y entradas.
          {" "}
          <span className="text-xs">
            {usingBlob ? "(Almacenamiento: Vercel Blob)" : "(Desarrollo: carpeta local public/media)"}
          </span>
        </p>
      </header>

      <form action={uploadMedia} className="mb-6 rounded-2xl border border-cream-deep bg-white p-5">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-slate">Imagen (máx. 8 MB)</span>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-coral file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-coral-dark"
            />
          </label>
          <label className="flex-1 text-sm">
            <span className="mb-1.5 block font-semibold text-slate">Texto alternativo (alt)</span>
            <input name="alt" placeholder="Descripción de la imagen" className="w-full rounded-xl border border-cream-deep px-3 py-2 text-sm outline-none focus:border-coral" />
          </label>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark">
            <Upload className="h-4 w-4" /> Subir
          </button>
        </div>
      </form>

      {media.length === 0 ? (
        <p className="rounded-2xl border border-cream-deep bg-white px-5 py-12 text-center text-sm text-warm-gray">
          Aún no has subido ninguna imagen.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-cream-deep bg-white">
              <div className="aspect-square bg-cream-deep/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt ?? m.filename} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-slate" title={m.filename}>{m.filename}</p>
                <p className="text-[11px] text-warm-gray">{formatSize(m.size)}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <CopyButton value={m.url} />
                  <form action={deleteMedia}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="text-warm-gray hover:text-red-600" title="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
