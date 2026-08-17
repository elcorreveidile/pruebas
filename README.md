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

## Panel de administración (`/admin`)

Área privada para gestionar el sitio sin WordPress. Sustituye a wp-admin con
solo lo que se usa de verdad, más rápido y sin plugins.

- **Auth por enlace mágico** (sin contraseñas): se introduce el email y Brevo
  envía un enlace de un solo uso (15 min). Solo entran los emails dados de alta
  en la tabla `User`. Sesión firmada con `jose` en cookie httpOnly; `src/proxy.ts`
  protege `/admin`.
- **Citas / Leads** (equivalente a Forminator): formulario público en
  `/primera-visita` y `/contacto` → guarda en BD y Brevo avisa a la clínica y
  responde al paciente. Bandeja en `/admin/leads` con estados, notas y export CSV.
- **Clientes / CRM ligero**: base de contactos en `/admin/clients` con búsqueda,
  ficha editable, notas, consentimiento RGPD (con fecha), **convertir una cita
  en cliente** (quedan enlazadas) y **exportación CSV + JSON** (portabilidad).
- **Blog** (equivalente a Divi + editor): CRUD en `/admin/blog` con **editor
  visual WYSIWYG** (negrita, títulos, listas, enlaces, imágenes — sin markdown).
  El blog público lee de la BD con ISR.
- **Páginas**: edición de todas las páginas de la web (`/admin/pages`) con el
  mismo editor visual. El sitio público (`[slug]`) lee de la BD con ISR.
- **Medios** (`/admin/media`): subida de imágenes a **Vercel Blob** (producción)
  o a `public/media` (desarrollo), con copia de URL y borrado.
- **Ajustes del sitio** (`/admin/settings`): contacto y horario editables; se
  reflejan en toda la web (ContactSection, Footer).
- **Usuarios** (`/admin/users`, solo admin): invitar (envía enlace mágico),
  roles (admin/editor), activar/desactivar y borrar.
- **SEO por página/entrada** (equivalente a Rank Math): título y descripción.
- **Cookies**: banner de consentimiento RGPD integrado (sin plugin).

### Stack del panel

- **Neon (PostgreSQL)** + **Prisma 7** (driver adapter `@prisma/adapter-pg`).
- **Brevo** para email transaccional (enlaces mágicos, avisos de leads).
- **Vercel Blob** para medios (fase posterior).
- **TipTap** para el editor visual del blog.

> Los **datos clínicos** de pacientes se mantienen en el software dental
> (Optimydent), no en la web: son categoría especial bajo RGPD. El panel solo
> gestiona marketing, leads y (próximamente) un CRM ligero de contactos.

### Puesta en marcha del panel

```bash
cp .env.local.example .env.local   # rellena DATABASE_URL, SESSION_SECRET, BREVO_*
npm run db:migrate                 # crea las tablas (necesita DATABASE_URL)
npm run db:seed                    # vuelca el contenido y crea el usuario admin
npm run dev
```

Variables de entorno relevantes (ver `.env.local.example`):

| Variable | Para qué |
| --- | --- |
| `DATABASE_URL` | Conexión a Neon/Postgres |
| `SESSION_SECRET` | Firma de la sesión (`openssl rand -base64 32`) |
| `BREVO_API_KEY` | Envío de emails (sin ella, se registran por consola en dev) |
| `BREVO_SENDER_EMAIL` / `BREVO_SENDER_NAME` | Remitente |
| `LEADS_NOTIFY_EMAIL` | Dónde llegan los avisos de nuevas citas |
| `ADMIN_EMAIL` | Primer usuario admin (usado por el seed) |
| `NEXT_PUBLIC_SITE_URL` | Base para los enlaces mágicos |
| `BLOB_READ_WRITE_TOKEN` | Medios en producción (Vercel Blob) |

Comandos de BD: `db:migrate`, `db:seed`, `db:push`, `db:studio`.

## Pendiente / posibles mejoras

1. Selector de imágenes de la biblioteca de **Medios** integrado en el editor
   (hoy se sube en Medios y se pega la URL).
2. Crear **páginas nuevas** desde el panel (hoy se editan las existentes).
3. Registrar el momento/versión del **consentimiento de cookies** por usuario si
   se añade analítica en el futuro.
4. Limpieza de `src/lib/content.ts` (quedan helpers de JSON ya no usados; el
   `treatments.json` sigue alimentando las tarjetas de la portada).
