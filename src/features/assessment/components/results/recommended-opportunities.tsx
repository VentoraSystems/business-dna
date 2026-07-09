"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DifficultyLevel, OPPORTUNITY_SAMPLE_IDS, RevenueSpeed, ScalabilityLevel } from "./config";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const DIFFICULTY_BADGE_VARIANT: Record<DifficultyLevel, BadgeProps["variant"]> = {
  low: "success",
  medium: "warning",
  high: "error",
};

const SCALABILITY_BADGE_VARIANT: Record<ScalabilityLevel, BadgeProps["variant"]> = {
  low: "neutral",
  medium: "accent",
  high: "success",
};

const REVENUE_SPEED_BADGE_VARIANT: Record<RevenueSpeed, BadgeProps["variant"]> = {
  slow: "neutral",
  moderate: "accent",
  fast: "success",
};

function formatBudget(min: number, max: number) {
  const format = (value: number) => `$${value.toLocaleString("en-US")}`;
  return `${format(min)} – ${format(max)}`;
}

interface RecommendedOpportunitiesProps {
  opportunities: {
    id: (typeof OPPORTUNITY_SAMPLE_IDS)[number];
    compatibility: number;
    difficulty: DifficultyLevel;
    budgetMin: number;
    budgetMax: number;
    revenueSpeed: RevenueSpeed;
    scalability: ScalabilityLevel;
  }[];
}

export function RecommendedOpportunities({ opportunities }: RecommendedOpportunitiesProps) {
  const t = useTranslations("assessment.results");

  return (
    <section>
      <h2 className="mb-1 text-2xl">{t("opportunities.sectionTitle")}</h2>
      <p className="mb-2 text-sm text-muted-foreground">{t("opportunities.sectionSubtitle")}</p>
      <p className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" />
        {t("opportunities.disclaimer")}
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {opportunities.map((opportunity) => (
          <motion.div key={opportunity.id} variants={itemVariants}>
            <Card className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                <div>
                  <p className="font-display text-lg">
                    {t(`opportunities.samples.${opportunity.id}.name`)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t(`opportunities.samples.${opportunity.id}.description`)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("opportunities.compatibilityLabel")}</span>
                  <span className="font-semibold">{opportunity.compatibility}%</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={DIFFICULTY_BADGE_VARIANT[opportunity.difficulty]}>
                    {t(`opportunities.difficulty.${opportunity.difficulty}`)}
                  </Badge>
                  <Badge variant={SCALABILITY_BADGE_VARIANT[opportunity.scalability]}>
                    {t(`opportunities.scalability.${opportunity.scalability}`)}
                  </Badge>
                  <Badge variant={REVENUE_SPEED_BADGE_VARIANT[opportunity.revenueSpeed]}>
                    {t(`opportunities.revenueSpeed.${opportunity.revenueSpeed}`)}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  {t("opportunities.budgetLabel")}: {formatBudget(opportunity.budgetMin, opportunity.budgetMax)}
                </p>

                <Button variant="secondary" className="mt-auto" disabled>
                  {t("opportunities.exploreButton")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
