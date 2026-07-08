"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { totalQuestionCount } from "../config/sections";
import { SectionOverview } from "./section-overview";

const SECONDS_PER_QUESTION = 9;

interface IntroScreenProps {
  hasProgress: boolean;
  onStart: () => void;
}

export function IntroScreen({ hasProgress, onStart }: IntroScreenProps) {
  const t = useTranslations("assessment.intro");
  const estimatedMinutes = Math.max(1, Math.round((totalQuestionCount * SECONDS_PER_QUESTION) / 60));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-xl flex-col items-center py-12 text-center"
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
        {t("eyebrow")}
      </p>
      <h1 className="mb-4 text-4xl leading-tight">{t("title")}</h1>
      <p className="mb-2 max-w-md text-muted-foreground">{t("subtitle")}</p>
      <p className="mb-10 text-xs text-muted-foreground">
        {t("estimatedTimeLabel", { minutes: estimatedMinutes })}
      </p>

      <div className="mb-10 w-full max-w-sm rounded-lg border border-border bg-surface p-4 text-left">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("sectionOverviewTitle")}
        </p>
        <SectionOverview />
      </div>

      <Button size="lg" onClick={onStart}>
        {hasProgress ? t("resumeCta") : t("startCta")}
      </Button>
    </motion.div>
  );
}
