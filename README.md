# La Fábrica de Sonrisas — Granada (migración a Next.js)

Migración del sitio WordPress [lafabricadesonrisasgranada.com](https://www.lafabricadesonrisasgranada.com)
(clínica dental de autor en Granada) a **Next.js**.

El contenido real (textos, imágenes, tratamientos, equipo, blog y datos de
contacto) se ha importado desde el sitio original vía la API `wp-json` y se
sirve de forma estática y autocontenida (imágenes locales en `public/media`).

> ℹ️ El sitio se mantiene con `noindex, nofollow` mientras no sea la web
> productiva, para no competir con el dominio original en buscadores.

---

## Origen (WordPress)

- **Tema:** Divi (Elegant Themes) + DiviFlash.
- **Plugins detectados:** Rank Math SEO, Complianz (cookies/RGPD), Forminator
  (formularios), WP Smush (imágenes), Redirection, WP 2FA.
- **Contenido importado:** 22 páginas (13 tratamientos + institucionales +
  legales), 14 entradas de blog y 53 imágenes.

El scraping y la conversión Divi → modelo de bloques se hicieron con scripts
puntuales; el resultado vive en `src/content/*.json` (versionado), por lo que
el sitio **no depende de la web original en tiempo de ejecución**.

## Stack

- **Next.js 16 (App Router)** + TypeScript
- **Tailwind CSS v4**
- Tipografías **Montserrat** (títulos) + **Nunito Sans** (texto), vía `next/font`
- Paleta de marca importada del original (coral `#ff7f67`, crema, salvia, teal)

## Instalación local

```bash
npm install
cp .env.local.example .env.local   # opcional
npm run dev
```

Abre http://localhost:3000

## Estructura de rutas

Se conservan las URLs originales del sitio WordPress.

| Ruta                                   | Descripción                                   |
| -------------------------------------- | --------------------------------------------- |
| `/`                                    | Portada (hero, servicios, método BHA, equipo) |
| `/{tratamiento}-en-granada`            | Páginas de tratamiento (ortodoncia, implantes…) |
| `/quienes-somos`, `/el-equipo`         | Institucionales                               |
| `/solidarios-y-sostenibles`, `/medios` | Institucionales                               |
| `/primera-visita`, `/contacto`         | Cita y contacto (con mapa)                     |
| `/blog`, `/blog/[slug]`                | Blog (14 entradas)                            |
| `/aviso-legal`, `/politica-de-privacidad`, `/politica-de-cookies` | Legales |

Las páginas de contenido se generan de forma estática desde
`src/content/pages.json` y `src/content/posts.json` mediante la ruta dinámica
`src/app/[slug]/page.tsx` y un renderizador de bloques
(`src/components/blocks/BlockRenderer.tsx`).

## Contenido y datos

- `src/lib/site.ts` — datos de contacto, horario, menú y enlaces legales.
- `src/content/treatments.json` — catálogo de tratamientos (home).
- `src/content/pages.json` / `posts.json` — páginas y entradas migradas.
- `public/media/` — imágenes locales del sitio.

## Pendiente / posibles mejoras

1. Implementar el formulario de cita/leads (Forminator en el original) y
   conectarlo a un backend.
2. Integrar la política de cookies completa (Complianz) y el banner de consentimiento.
3. Revisar metadatos SEO por página (Rank Math) si se desea replicarlos al detalle.
