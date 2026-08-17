"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { htmlToBlocks } from "@/lib/blocks";

const PageSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2, "El título es obligatorio."),
  excerpt: z.string().trim().max(5000).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: z.string().trim().max(120).optional(),
  seoDescription: z.string().trim().max(400).optional(),
  body: z.string().optional(),
});

export interface PageFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  saved?: boolean;
}

export async function savePage(
  _prev: PageFormState,
  formData: FormData,
): Promise<PageFormState> {
  await getCurrentUser();

  const parsed = PageSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt") || undefined,
    status: formData.get("status"),
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    body: formData.get("body") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Revisa los campos.", fieldErrors };
  }

  const d = parsed.data;
  const blocks = htmlToBlocks(d.body ?? "") as object;

  const page = await prisma.page.update({
    where: { id: d.id },
    data: {
      title: d.title,
      excerpt: d.excerpt || null,
      status: d.status,
      seoTitle: d.seoTitle || null,
      seoDescription: d.seoDescription || null,
      blocks: blocks as never,
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/${page.slug}`);
  revalidatePath("/");
  return { saved: true };
}

export async function togglePagePublish(formData: FormData) {
  await getCurrentUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return;
  await prisma.page.update({
    where: { id },
    data: { status: page.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });
  revalidatePath("/admin/pages");
  revalidatePath(`/${page.slug}`);
}
