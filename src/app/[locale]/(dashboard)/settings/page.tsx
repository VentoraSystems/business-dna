import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProfileForm } from "@/features/settings/components/profile-form";

const tabKeys = [
  "profile",
  "businessPreferences",
  "notifications",
  "subscription",
  "billing",
  "security",
  "integrations",
  "appearance",
] as const;

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("settings");

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[200px_1fr]">
      <nav className="hidden lg:block">
        <ul className="space-y-1 text-sm text-muted-foreground">
          {tabKeys.map((key, i) => (
            <li
              key={key}
              className={`rounded-md px-3 py-2 ${
                i === 0 ? "bg-accent/15 font-semibold text-foreground" : "hover:bg-muted"
              }`}
            >
              {t(`tabs.${key}` as "tabs.profile")}
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-6">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("tabs.profile")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("tabs.language")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("language.description")}</p>
          </CardHeader>
          <CardContent>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("tabs.appearance")}</CardTitle>
          </CardHeader>
          <CardContent className="max-w-xs">
            <ThemeToggle />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
