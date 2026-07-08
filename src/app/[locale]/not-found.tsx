import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("errors.notFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl text-accent">404</p>
      <h1 className="font-display text-2xl">{t("title")}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{t("description")}</p>
      <Button asChild>
        <Link href="/">{t("action")}</Link>
      </Button>
    </div>
  );
}
