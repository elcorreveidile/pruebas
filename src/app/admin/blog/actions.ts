"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { slugify } from "@/lib/utils";
import { htmlToBlocks } from "@/lib/blocks";

const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "El título es obligatorio."),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().max(5000).optional(),
  coverImage: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: z.string().trim().max(120).optional(),
  seoDescription: z.string().trim().max(400).optional(),
  body: z.string().optional(),
});

export interface PostFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "entrada";
  let slug = root;
  let n = 1;
  // Evita colisiones de slug.
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${root}-${++n}`;
  }
}

export async function savePost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await getCurrentUser();

  const parsed = PostSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    coverImage: formData.get("coverImage") || undefined,
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
  const wasPublished = d.status === "PUBLISHED";
  const slug = await uniqueSlug(d.slug || d.title, d.id);

  if (d.id) {
    const current = await prisma.post.findUnique({ where: { id: d.id } });
    await prisma.post.update({
      where: { id: d.id },
      data: {
        title: d.title,
        slug,
        excerpt: d.excerpt || null,
        coverImage: d.coverImage || null,
        status: d.status,
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
        blocks: blocks as never,
        publishedAt:
          wasPublished && !current?.publishedAt ? new Date() : current?.publishedAt,
      },
    });
  } else {
    await prisma.post.create({
      data: {
        title: d.title,
        slug,
        excerpt: d.excerpt || null,
        coverImage: d.coverImage || null,
        status: d.status,
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
        blocks: blocks as never,
        publishedAt: wasPublished ? new Date() : null,
      },
    });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  await getCurrentUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const post = await prisma.post.findUnique({ where: { id } });
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (post) revalidatePath(`/blog/${post.slug}`);
  redirect("/admin/blog");
}

export async function togglePublish(formData: FormData) {
  await getCurrentUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return;
  const publish = post.status !== "PUBLISHED";
  await prisma.post.update({
    where: { id },
    data: {
      status: publish ? "PUBLISHED" : "DRAFT",
      publishedAt: publish && !post.publishedAt ? new Date() : post.publishedAt,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
}
