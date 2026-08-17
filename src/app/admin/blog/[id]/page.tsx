import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import PostForm from "@/components/admin/PostForm";
import { blocksToHtml } from "@/lib/blocks";
import type { Block } from "@/types";
import { deletePost } from "../actions";

export const metadata: Metadata = { title: "Editar entrada" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const blocks = (post.blocks as Block[]) ?? [];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al blog
        </Link>
        {post.status === "PUBLISHED" && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark"
          >
            Ver en el sitio <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </div>

      <h1 className="mb-6 text-2xl font-bold text-ink">Editar entrada</h1>

      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          coverImage: post.coverImage ?? "",
          status: post.status,
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
          body: blocksToHtml(blocks),
        }}
      />

      <form action={deletePost} className="mt-8 border-t border-cream-deep pt-5">
        <input type="hidden" name="id" value={post.id} />
        <button
          type="submit"
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" /> Eliminar esta entrada
        </button>
      </form>
    </div>
  );
}
