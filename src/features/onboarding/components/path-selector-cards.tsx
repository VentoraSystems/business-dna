"use client";

import { Sparkles, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PathSelectorCards() {
  const t = useTranslations("onboarding");

  const paths = [
    {
      href: "/assessment",
      icon: Sparkles,
      titleKey: "findBusiness.title",
      subtitleKey: "findBusiness.subtitle",
    },
    {
      href: "/businesses/new",
      icon: Rocket,
      titleKey: "haveIdea.title",
      subtitleKey: "haveIdea.subtitle",
    },
  ] as const;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {paths.map((path) => {
        const Icon = path.icon;
        return (
          <Link key={path.href} href={path.href}>
            <Card
              className={cn(
                "group h-full transition-all hover:-translate-y-0.5 hover:shadow-soft"
              )}
            >
              <CardContent className="flex h-full flex-col items-start gap-4 pt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent/15 text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl">{t(path.titleKey as "findBusiness.title")}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(path.subtitleKey as "findBusiness.subtitle")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
