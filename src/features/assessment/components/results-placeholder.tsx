"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultsPlaceholder() {
  const t = useTranslations("assessment.results");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl py-8 text-center"
    >
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="mb-3 text-3xl">{t("title")}</h1>
      <p className="mb-10 text-muted-foreground">{t("subtitle")}</p>

      <div className="grid gap-4 text-left sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="space-y-3 pt-6">
              <p className="text-sm font-semibold text-muted-foreground">
                {t("cardTitlePlaceholder")}
              </p>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <p className="pt-2 text-xs text-muted-foreground">{t("cardSubtitlePlaceholder")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="secondary" className="mt-10" asChild>
        <Link href="/dashboard">{t("backToDashboard")}</Link>
      </Button>
    </motion.div>
  );
}
