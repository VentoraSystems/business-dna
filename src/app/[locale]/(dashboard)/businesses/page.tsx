import { Building2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";

function formatEuros(value: number | null) {
  return value === null ? "—" : `€${value.toLocaleString("en-US")}`;
}

export default async function BusinessesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("businesses");
  const tButtons = await getTranslations("buttons");

  const user = await requireCurrentUser();
  const businesses = await db.business.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {businesses.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={t("title")}
          description={t("empty")}
          action={
            <Button asChild>
              <Link href="/assessment">{tButtons("startAssessment")}</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Link key={business.id} href={`/businesses/${business.id}`}>
              <Card className="h-full transition-colors hover:border-accent">
                <CardContent className="flex h-full flex-col gap-3 py-5">
                  <div>
                    {business.compatibility !== null && (
                      <Badge variant="accent" className="mb-2">
                        {business.compatibility}% {t("compatibility")}
                      </Badge>
                    )}
                    <p className="font-display text-lg">{business.name}</p>
                    {business.summary && (
                      <p className="mt-1 text-xs text-muted-foreground">{business.summary}</p>
                    )}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      {t("difficulty")}: {business.difficulty}
                    </span>
                    <span>
                      {t("investment")}: {formatEuros(business.investmentMin)} – {formatEuros(business.investmentMax)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
