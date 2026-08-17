import { prisma } from "@/lib/db";
import type { Block } from "@/types";

/** Post público ya normalizado para renderizar. */
export interface PublicPost {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  blocks: Block[];
  seoTitle: string | null;
  seoDescription: string | null;
}

function toPublic(p: {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  blocks: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
}): PublicPost {
  return { ...p, blocks: (p.blocks as Block[]) ?? [] };
}

/** Entradas publicadas, de más reciente a más antigua. */
export async function getPublishedPosts(): Promise<PublicPost[]> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return posts.map(toPublic);
}

export async function getPublishedPost(slug: string): Promise<PublicPost | null> {
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  return post ? toPublic(post) : null;
}
