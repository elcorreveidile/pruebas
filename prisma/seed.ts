/**
 * Seed de la base de datos: vuelca el contenido ya migrado (JSON versionados)
 * y crea el usuario administrador inicial.
 *
 * Uso (con DATABASE_URL apuntando a Neon o Postgres local):
 *   npx prisma migrate dev --name init   # crea las tablas
 *   npx prisma db seed                    # rellena el contenido
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient, PageKind, ContentStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const ROOT = join(process.cwd(), "src", "content");

type Block = unknown;
interface ContentPage {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  blocks: Block[];
}
interface TreatmentJson {
  slug: string;
  nombre: string;
  descripcion: string;
  icono?: string | null;
}

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(ROOT, name), "utf8")) as T;
}

const HOME_SLUG = "pagina-de-inicio";
const LEGAL_SLUGS = new Set([
  "aviso-legal",
  "politica-de-privacidad",
  "politica-de-cookies",
]);

async function main() {
  const pages = readJson<ContentPage[]>("pages.json");
  const posts = readJson<ContentPage[]>("posts.json");
  const treatments = readJson<TreatmentJson[]>("treatments.json");
  const treatmentSlugs = new Set(treatments.map((t) => t.slug));

  // --- Usuario administrador inicial -------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL ?? "javier@blablaele.com";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", isActive: true },
    create: { email: adminEmail, name: "Administración", role: "ADMIN" },
  });
  console.log(`✓ Usuario admin: ${adminEmail}`);

  // --- Tratamientos (tarjetas de la portada) -----------------------------
  for (const [i, t] of treatments.entries()) {
    await prisma.treatment.upsert({
      where: { slug: t.slug },
      update: { nombre: t.nombre, descripcion: t.descripcion, icono: t.icono ?? null, order: i },
      create: {
        slug: t.slug,
        nombre: t.nombre,
        descripcion: t.descripcion,
        icono: t.icono ?? null,
        order: i,
      },
    });
  }
  console.log(`✓ ${treatments.length} tratamientos`);

  // --- Páginas -----------------------------------------------------------
  for (const [i, p] of pages.entries()) {
    const kind: PageKind = p.slug === HOME_SLUG
      ? PageKind.HOME
      : LEGAL_SLUGS.has(p.slug)
        ? PageKind.LEGAL
        : treatmentSlugs.has(p.slug)
          ? PageKind.TREATMENT
          : PageKind.PAGE;
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt ?? null,
        kind,
        // biome/prisma: Json fields aceptan el array de bloques tal cual
        blocks: p.blocks as object,
        order: i,
      },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? null,
        kind,
        blocks: p.blocks as object,
        status: ContentStatus.PUBLISHED,
        order: i,
      },
    });
  }
  console.log(`✓ ${pages.length} páginas`);

  // --- Entradas de blog --------------------------------------------------
  for (const p of posts) {
    const publishedAt = p.date ? new Date(p.date) : new Date();
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt ?? null,
        blocks: p.blocks as object,
        status: ContentStatus.PUBLISHED,
        publishedAt,
      },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? null,
        blocks: p.blocks as object,
        status: ContentStatus.PUBLISHED,
        publishedAt,
      },
    });
  }
  console.log(`✓ ${posts.length} entradas de blog`);

  // --- Ajustes del sitio (contacto, horario, menú, legales) --------------
  const settings: { key: string; value: object }[] = [
    {
      key: "contact",
      value: {
        phone: "958 22 74 74",
        phoneHref: "tel:+34958227474",
        whatsapp: "663 82 89 30",
        whatsappHref: "https://wa.me/34663828930",
        email: "lafabricadesonrisasgranada@gmail.com",
        address: "Calle Molinos, 34 · Barrio del Realejo · Granada",
        mapsUrl: "https://maps.app.goo.gl/iuHbUAT3Pq1nhSHt9",
      },
    },
    {
      key: "schedule",
      value: {
        items: [
          { dia: "Lunes y miércoles", horas: "9:30 – 18:30" },
          { dia: "Martes y jueves", horas: "9:30 – 13:30 / 16:00 – 20:00" },
          { dia: "Viernes", horas: "9:30 – 13:30" },
          { dia: "Sábados y domingos", horas: "Cerrado" },
        ],
      },
    },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log(`✓ ${settings.length} ajustes del sitio`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completado.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
