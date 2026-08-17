import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto (evita el aviso de "workspace root" cuando hay
  // varios lockfiles en el sistema).
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  // Todo el contenido multimedia se sirve localmente desde /public/media,
  // por lo que no se necesitan dominios remotos para las imágenes.
};

export default nextConfig;
