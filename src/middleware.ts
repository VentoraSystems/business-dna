import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

// Routes that require a signed-in user. Locale prefix is optional so both
// "/dashboard" and "/ro/dashboard" need to match.
const isProtectedRoute = createRouteMatcher([
  "/(ro/)?dashboard(.*)",
  "/(ro/)?assessment(.*)",
  "/(ro/)?businesses(.*)",
  "/(ro/)?blueprint(.*)",
  "/(ro/)?roadmap(.*)",
  "/(ro/)?co-founder(.*)",
  "/(ro/)?templates(.*)",
  "/(ro/)?resources(.*)",
  "/(ro/)?settings(.*)",
  "/(ro/)?start(.*)",
]);

const isAdminRoute = createRouteMatcher(["/(ro/)?admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  if (isProtectedRoute(req) && !userId) {
    await auth.protect();
  }

  if (isAdminRoute(req)) {
    const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|api|.*\\..*).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
