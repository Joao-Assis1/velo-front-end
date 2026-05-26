import { Page } from "@playwright/test";

type UserRole = "student" | "instructor";

const DEFAULT_PROFILES: Record<UserRole, Record<string, unknown>> = {
  student: {
    id: "e2e-student-1",
    name: "Aluno Teste E2E",
    ladvUploaded: false,
    paymentMethods: [],
  },
  instructor: {
    id: "e2e-instructor-1",
    name: "Instrutor Teste E2E",
    rating: 4.8,
    reviewsCount: 15,
    pricePerClass: 120,
    availability: [],
    busySlots: [],
  },
};

/**
 * Generates a fake JWT with the correct structure so the middleware can decode
 * the payload and route the user to the right dashboard (/student vs /instructor).
 * The signature is not cryptographically valid — backend auth is bypassed in E2E
 * tests via X-Test-Mode header.
 */
function makeFakeJwt(role: UserRole): string {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ role, sub: `e2e-${role}` })).toString("base64url");
  return `${header}.${payload}.e2e-sig`;
}

/**
 * Bypasses the real login form by injecting the auth cookie and localStorage
 * directly. The middleware only checks for the presence of the velo-token
 * cookie (and decodes payload for role-based routing), so a fake JWT grants
 * access to /app/* without a real backend.
 */
export async function loginAs(
  page: Page,
  email: string,
  _password = "123456",
  role: UserRole = "student",
) {
  const profile = { ...DEFAULT_PROFILES[role], email };
  const token = makeFakeJwt(role);

  await page.goto("/auth/login");

  await page.evaluate(
    ({ role, profile, token }) => {
      localStorage.setItem("velo-token", token);
      localStorage.setItem("velo-userRole", JSON.stringify(role));
      const key =
        role === "student" ? "velo-studentProfile" : "velo-instructorProfile";
      localStorage.setItem(key, JSON.stringify(profile));
    },
    { role, profile, token },
  );

  await page.context().addCookies([
    {
      name: "velo-token",
      value: token,
      domain: "localhost",
      path: "/",
      sameSite: "Lax",
    },
  ]);
}
