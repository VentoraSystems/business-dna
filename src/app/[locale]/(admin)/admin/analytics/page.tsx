import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AdminAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  return (
    <div className="rounded-lg border border-[#2B2924] bg-[#1F1D18] p-6 text-sm text-[#9C988E]">
      {t("placeholderNote")}
    </div>
  );
}
