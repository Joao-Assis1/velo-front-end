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
 * Bypasses the real login form by injecting the auth cookie and localStorage
 * directly. The middleware only checks for the presence of the velo-token
 * cookie, so any non-empty value grants access to /app/*.
 *
 * This avoids depending on the backend being available for auth.
 */
export async function loginAs(
  page: Page,
  email: string,
  _password = "123456",
  role: UserRole = "student",
) {
  const profile = { ...DEFAULT_PROFILES[role], email };
  const token = "e2e-test-token";

  // Navigate first to get a page context (no cookie yet, so middleware
  // serves the login page instead of redirecting to /app).
  await page.goto("/auth/login");

  // Inject auth state so AppContext hydrates correctly on the next navigation.
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

  // Set cookie so middleware allows access to /app/* on the next navigation.
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
