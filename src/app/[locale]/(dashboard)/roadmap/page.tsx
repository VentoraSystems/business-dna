import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";

/**
 * Same pattern as the Blueprint top-level redirect (see
 * businesses/[businessId]/blueprint's sibling top-level route) — the
 * sidebar's generic "Roadmap" nav link has no business context, so it
 * redirects to the user's most-recently-adopted business's roadmap, or to
 * the businesses list (which already has a real empty state) if they
 * haven't adopted one yet.
 */
export default async function RoadmapRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await requireCurrentUser();
  const mostRecentBusiness = await db.business.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (mostRecentBusiness) {
    redirect({ href: `/businesses/${mostRecentBusiness.id}/roadmap`, locale });
  }
  redirect({ href: "/businesses", locale });
}
