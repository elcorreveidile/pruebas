import "server-only";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { slugify } from "@/lib/utils";

export interface StoredFile {
  url: string;
  pathname: string;
  contentType: string | null;
  size: number;
}

const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

function safeName(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const base = dot > 0 ? filename.slice(0, dot) : filename;
  const ext = dot > 0 ? filename.slice(dot).toLowerCase() : "";
  return `${slugify(base) || "archivo"}-${randomUUID().slice(0, 8)}${ext}`;
}

/**
 * Sube una imagen. En producción usa Vercel Blob (si hay token); en desarrollo
 * escribe en `public/media` para poder probar sin credenciales.
 */
export async function uploadImage(file: File): Promise<StoredFile> {
  const pathname = `media/${safeName(file.name)}`;

  if (hasBlob()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type || undefined,
    });
    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type || null,
      size: file.size,
    };
  }

  // Fallback local (desarrollo).
  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = join(process.cwd(), "public", "media");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, pathname.replace(/^media\//, "")), buffer);
  return {
    url: `/${pathname}`,
    pathname,
    contentType: file.type || null,
    size: file.size,
  };
}

/** Elimina el archivo del almacenamiento (Blob o local). No falla si no existe. */
export async function deleteStored(url: string, pathname: string): Promise<void> {
  try {
    if (hasBlob() && /^https?:\/\//.test(url)) {
      const { del } = await import("@vercel/blob");
      await del(url);
    } else {
      const rel = pathname.replace(/^media\//, "");
      await unlink(join(process.cwd(), "public", "media", rel));
    }
  } catch {
    /* el archivo puede no existir; ignoramos */
  }
}
