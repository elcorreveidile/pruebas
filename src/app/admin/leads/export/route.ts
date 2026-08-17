import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { LEAD_STATUS_LABEL } from "@/lib/leads";

/** Exporta todas las citas a CSV (solo usuarios autenticados). */
export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return new Response("No autorizado", { status: 401 });
  }

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const header = [
    "Fecha",
    "Nombre",
    "Teléfono",
    "Email",
    "Tratamiento",
    "Estado",
    "Mensaje",
  ];
  const rows = leads.map((l) => [
    l.createdAt.toISOString(),
    l.name,
    l.phone,
    l.email ?? "",
    l.treatment ?? "",
    LEAD_STATUS_LABEL[l.status],
    (l.message ?? "").replace(/\r?\n/g, " "),
  ]);

  const csv = [header, ...rows]
    .map((r) => r.map(csvCell).join(","))
    .join("\r\n");

  // BOM para que Excel reconozca UTF-8.
  const body = "﻿" + csv;
  const date = new Date().toISOString().slice(0, 10);

  return new Response(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="citas-${date}.csv"`,
    },
  });
}

function csvCell(value: string): string {
  const v = String(value);
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
