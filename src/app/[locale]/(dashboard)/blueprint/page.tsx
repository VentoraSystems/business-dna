import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";

/**
 * A Blueprint always belongs to a specific Business (see
 * businesses/[businessId]/blueprint — the real page, added in Part 3). This
 * top-level route only exists because the sidebar nav links here generically
 * ("Blueprint", with no business context) — it redirects to the user's
 * most-recently-adopted business's plan, or to the businesses list (which
 * already has a real empty state) if they haven't adopted one yet.
 */
export default async function BlueprintRedirectPage({
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
    redirect({ href: `/businesses/${mostRecentBusiness.id}/blueprint`, locale });
  }
  redirect({ href: "/businesses", locale });
}
