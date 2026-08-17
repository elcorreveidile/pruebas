import { prisma } from "@/lib/db";
import type { Block } from "@/types";
import type { PageKind } from "@prisma/client";

/** Slug de la portada (no se sirve por la ruta [slug]). */
export const HOME_SLUG = "pagina-de-inicio";

export interface PublicPage {
  slug: string;
  title: string;
  excerpt: string | null;
  kind: PageKind;
  blocks: Block[];
  seoTitle: string | null;
  seoDescription: string | null;
}

function toPublic(p: {
  slug: string;
  title: string;
  excerpt: string | null;
  kind: PageKind;
  blocks: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
}): PublicPage {
  return { ...p, blocks: (p.blocks as Block[]) ?? [] };
}

/** Slugs de páginas de contenido publicadas (excluye la portada). */
export async function getContentPageSlugs(): Promise<string[]> {
  const pages = await prisma.page.findMany({
    where: { status: "PUBLISHED", NOT: { kind: "HOME" } },
    select: { slug: true },
  });
  return pages.map((p) => p.slug);
}

/** Página de contenido publicada por slug (no la portada). */
export async function getPublicPage(slug: string): Promise<PublicPage | null> {
  if (slug === HOME_SLUG) return null;
  const page = await prisma.page.findFirst({
    where: { slug, status: "PUBLISHED", NOT: { kind: "HOME" } },
  });
  return page ? toPublic(page) : null;
}

/** Bloques de la portada (para las FAQ del método BHA, etc.). */
export async function getHomeBlocks(): Promise<Block[]> {
  const home = await prisma.page.findUnique({ where: { slug: HOME_SLUG } });
  return home ? ((home.blocks as Block[]) ?? []) : [];
}
