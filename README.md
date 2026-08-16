# La Fábrica de Sonrisas — Granada (migración a Next.js)

Migración del sitio WordPress [lafabricadesonrisasgranada.com](https://www.lafabricadesonrisasgranada.com)
(clínica dental en Granada) a **Next.js**, siguiendo el mismo flujo usado en
otras migraciones del grupo (laskentukianas, olvidos, reinaldo).

> ⚠️ **Scaffold en desarrollo.** Estructura y estilos base montados; el contenido
> real (textos, imágenes, tratamientos, datos de contacto) está pendiente de
> importar desde el sitio original. `noindex, nofollow` activo en todo el sitio.

---

## Stack

- **Next.js 16 (App Router)** + TypeScript
- **Tailwind CSS v4**
- **Vercel** (despliegue previsto)
- Backend de datos (leads / tratamientos) previsto sobre **Supabase**, aún sin conectar.

---

## Instalación local

```bash
npm install
cp .env.local.example .env.local   # edita los valores
npm run dev
```

Abre http://localhost:3000

---

## Estructura de rutas

| Ruta                     | Estado    | Descripción                                  |
| ------------------------ | --------- | -------------------------------------------- |
| `/`                      | scaffold  | Home con hero + bloques de servicios         |
| `/tratamientos`          | scaffold  | Listado de tratamientos                      |
| `/tratamientos/[slug]`   | scaffold  | Detalle de tratamiento                       |
| `/equipo`                | scaffold  | Equipo de la clínica                         |
| `/contacto`              | scaffold  | Datos de contacto + (futuro) formulario/mapa |
| `/cita`                  | scaffold  | Formulario de solicitud de cita (pendiente)  |
| `/legal/aviso-legal`     | scaffold  | Aviso legal                                  |
| `/legal/privacidad`      | scaffold  | Política de privacidad                       |
| `/legal/cookies`         | scaffold  | Política de cookies                          |

---

## Pendiente (siguiente sesión con red abierta)

1. Rascar el contenido real del WordPress vía `wp-json` / scraping.
2. Volcar textos, imágenes y catálogo de tratamientos.
3. Rellenar datos de contacto reales en `src/lib/site.ts`.
4. Implementar el formulario de cita/leads y conectarlo a Supabase.
5. Sustituir la paleta/tipografías si el diseño original difiere.
