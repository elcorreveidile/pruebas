import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PostForm from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Nueva entrada" };

export default function NewPostPage() {
  return (
    <div>
      <Link
        href="/admin/blog"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-warm-gray hover:text-coral-dark"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al blog
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-ink">Nueva entrada</h1>
      <PostForm
        post={{
          title: "",
          slug: "",
          excerpt: "",
          coverImage: "",
          status: "DRAFT",
          seoTitle: "",
          seoDescription: "",
          body: "",
        }}
      />
    </div>
  );
}
