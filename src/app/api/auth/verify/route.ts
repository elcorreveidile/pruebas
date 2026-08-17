import { NextResponse, type NextRequest } from "next/server";
import { consumeMagicLink } from "@/lib/auth";
import { createSession } from "@/lib/session";

/**
 * Callback del enlace mágico: /api/auth/verify?token=...&email=...
 * Si el token es válido, crea la sesión y entra al panel.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.nextUrl));
  }

  const user = await consumeMagicLink(email, token);
  if (!user) {
    return NextResponse.redirect(
      new URL("/login?error=expired", request.nextUrl),
    );
  }

  await createSession({ userId: user.id, email: user.email, role: user.role });
  return NextResponse.redirect(new URL("/admin", request.nextUrl));
}
