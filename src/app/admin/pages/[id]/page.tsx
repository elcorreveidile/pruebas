import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import PageForm from "@/components/admin/PageForm";
import { blocksToHtml } from "@/lib/blocks";
import type { Block } from "@/types";

export const metadata: Metadata = { title: "Editar página" };
export const dynamic = "force-dynamic";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  const blocks = (page.blocks as Block[]) ?? [];

  return (
    <div>
      <Link
        href="/admin/pages"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a páginas
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-ink">Editar página</h1>

      <PageForm
        page={{
          id: page.id,
          slug: page.slug,
          title: page.title,
          excerpt: page.excerpt ?? "",
          status: page.status,
          seoTitle: page.seoTitle ?? "",
          seoDescription: page.seoDescription ?? "",
          body: blocksToHtml(blocks),
        }}
      />
    </div>
  );
}
