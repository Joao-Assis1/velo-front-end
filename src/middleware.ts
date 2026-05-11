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
    return NextResponse.redirect(new URL("/app/student/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/auth/login", "/auth/register/:path*"],
};
