import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "better-auth/types";

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas que exigem login
  const isProtected = pathname.startsWith("/app");
  // Rotas exclusivas para não logados (login/registro)
  const isAuthRoute = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  // Verifica a sessão via chamadas internas ao Better Auth server
  // Como estamos no Middleware, o fetch manda os cookies originais para o Neon
  const { data: session } = await betterFetch<Session>(
    `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/get-session`,
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  // Se não tem sessão e tentou acessar rota protegida -> manda pro login
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Se tem sessão e está na tela de login/registro -> manda pro dashboard
  // (Idealmente verificaríamos o role e status do KYC para mandar para a rota certa)
  if (session && isAuthRoute) {
    // Por enquanto, direciona alunos pro dashboard (MVP)
    return NextResponse.redirect(new URL("/app/student/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/auth/login", "/auth/register"],
};
