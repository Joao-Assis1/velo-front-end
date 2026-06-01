import { NextResponse, type NextRequest } from "next/server";

export default function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/app");
  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("velo-token")?.value;

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isAuthRoute) {
    // Decode JWT payload only for UI routing (student vs instructor dashboard).
    // Signature verification is intentionally skipped here — the backend validates
    // the Bearer token on every API call. The middleware's sole job is redirect UX.
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const dest =
        payload.role === "instructor"
          ? "/app/instructor/dashboard"
          : "/app/student/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    } catch {
      return NextResponse.redirect(new URL("/app/student/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/auth/login", "/auth/register/:path*"],
};
