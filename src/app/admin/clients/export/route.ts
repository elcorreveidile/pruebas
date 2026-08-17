import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

/**
 * Exporta los clientes para portabilidad de datos (RGPD).
 *   /admin/clients/export           → CSV
 *   /admin/clients/export?format=json → JSON completo (con notas y citas)
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) return new Response("No autorizado", { status: 401 });

  const format = request.nextUrl.searchParams.get("format");
  const date = new Date().toISOString().slice(0, 10);

  if (format === "json") {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        notes: { orderBy: { createdAt: "asc" } },
        leads: { orderBy: { createdAt: "asc" } },
      },
    });
    return new Response(JSON.stringify(clients, null, 2), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="clientes-${date}.json"`,
      },
    });
  }

  const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
  const header = [
    "Nombre",
    "Teléfono",
    "Email",
    "Interés",
    "Origen",
    "Consiente marketing",
    "Fecha consentimiento",
    "Alta",
  ];
  const rows = clients.map((c) => [
    c.name,
    c.phone ?? "",
    c.email ?? "",
    c.interest ?? "",
    c.source,
    c.consentMarketing ? "Sí" : "No",
    c.consentAt ? c.consentAt.toISOString() : "",
    c.createdAt.toISOString(),
  ]);

  const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  return new Response("﻿" + csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="clientes-${date}.csv"`,
    },
  });
}

function csvCell(value: string): string {
  const v = String(value);
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
