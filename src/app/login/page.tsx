import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { site } from "@/lib/site";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso al panel",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  invalid: "El enlace no es válido.",
  expired: "El enlace ha caducado o ya se usó. Solicita uno nuevo.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session?.userId) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-deep/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ink">{site.name}</h1>
          <p className="mt-1 text-sm text-warm-gray">Panel de administración</p>
        </div>
        <LoginForm initialError={error ? ERRORS[error] : undefined} />
      </div>
    </div>
  );
}
