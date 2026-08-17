import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Configuración de Prisma 7 (CLI: migrate, db push, seed, studio…).
 * La URL de conexión vive aquí, ya no en schema.prisma.
 * El cliente en tiempo de ejecución usa el driver adapter (ver src/lib/db.ts).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "node prisma/seed.ts",
  },
});
