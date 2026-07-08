import { getTranslations, setRequestLocale } from "next-intl/server";
import { PathSelectorCards } from "@/features/onboarding/components/path-selector-cards";

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("onboarding");

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <PathSelectorCards />
    </div>
  );
}
