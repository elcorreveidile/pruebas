"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { uploadImage, deleteStored } from "@/lib/storage";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function uploadMedia(formData: FormData) {
  await getCurrentUser();
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) return;
  if (!file.type.startsWith("image/")) return;
  if (file.size > MAX_BYTES) return;

  const stored = await uploadImage(file);
  await prisma.media.create({
    data: {
      url: stored.url,
      pathname: stored.pathname,
      filename: file.name,
      contentType: stored.contentType,
      size: stored.size,
      alt: alt || null,
    },
  });

  revalidatePath("/admin/media");
}

export async function deleteMedia(formData: FormData) {
  await getCurrentUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;
  await deleteStored(media.url, media.pathname);
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}
