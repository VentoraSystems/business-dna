import { getTranslations, setRequestLocale } from "next-intl/server";

const statKeys = [
  "totalUsers",
  "assessmentsCompleted",
  "plansGenerated",
  "mrr",
  "activeSubscriptions",
  "openTickets",
] as const;

const sectionKeys = [
  "analytics",
  "blog",
  "featureFlags",
  "aiUsage",
  "systemHealth",
  "templates",
  "feedback",
] as const;

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {statKeys.map((key) => (
          <div key={key} className="rounded-lg border border-[#2B2924] bg-[#1F1D18] p-5">
            <p className="text-xs text-[#9C988E]">{t(`stats.${key}` as "stats.totalUsers")}</p>
            <p className="mt-2 font-display text-2xl">—</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[#2B2924] bg-[#1F1D18] p-6">
        <p className="mb-4 text-xs text-[#9C988E]">Sections</p>
        <div className="flex flex-wrap gap-2 text-sm">
          {sectionKeys.map((key) => (
            <span key={key} className="rounded-md border border-[#2B2924] px-3 py-2">
              {t(`sections.${key}` as "sections.analytics")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
