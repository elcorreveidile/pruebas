import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

/**
 * Comprobación optimista de sesión (solo lee la cookie, sin tocar la BD).
 * La comprobación segura se hace en el DAL (src/lib/dal.ts).
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // Protege todo /admin.
  if (pathname.startsWith("/admin") && !session?.userId) {
    const url = new URL("/login", req.nextUrl);
    return NextResponse.redirect(url);
  }

  // Si ya hay sesión y visita /login, entra directamente al panel.
  if (pathname === "/login" && session?.userId) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
