import pagesData from "@/content/pages.json";
import postsData from "@/content/posts.json";
import treatmentsData from "@/content/treatments.json";
import type { ContentPage, Treatment } from "@/types";

const pages = pagesData as unknown as ContentPage[];
const posts = postsData as unknown as ContentPage[];
export const treatments = treatmentsData as unknown as Treatment[];

/** Slug de la página que actúa como portada en WordPress (page_on_front = 8). */
export const HOME_SLUG = "pagina-de-inicio";

/** Todas las páginas de contenido excepto la portada. */
export function getContentPages(): ContentPage[] {
  return pages.filter((p) => p.slug !== HOME_SLUG);
}

export function getPage(slug: string): ContentPage | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getHome(): ContentPage | undefined {
  return pages.find((p) => p.slug === HOME_SLUG);
}

export function getPosts(): ContentPage[] {
  return posts;
}

export function getPost(slug: string): ContentPage | undefined {
  return posts.find((p) => p.slug === slug);
}

const TREATMENT_SLUGS = new Set(treatments.map((t) => t.slug));
export function isTreatment(slug: string): boolean {
  return TREATMENT_SLUGS.has(slug);
}
