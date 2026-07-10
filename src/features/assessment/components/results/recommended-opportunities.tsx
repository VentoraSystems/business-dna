"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DifficultyLevel, RevenueSpeed, ScalabilityLevel } from "./config";
import type { ResultsOpportunity } from "@/features/assessment/actions/results-actions";

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

/** All 21 seeded businesses use EUR (see prisma/seed-business-engine.ts) — formatting both budget and revenue with the same real currency symbol, rather than mock data's arbitrary $/€ split. */
function formatEuros(value: number) {
  return `€${value.toLocaleString("en-US")}`;
}

/**
 * Real as of Phase 3: `opportunities` come from persisted
 * `BusinessMatchResult` rows (see results-actions.ts), each business's
 * name/description read straight from its `business-dna.json`. Previously
 * this rendered 3 fixed, fictional sample businesses via
 * `opportunities.samples.<id>.name`/`.description` translation lookups —
 * that lookup only ever had 3 possible keys and couldn't represent a real
 * business, so this component's props changed shape (name/description are
 * now plain strings from the caller, not translation-key lookups) rather
 * than being reused as-is.
 */
interface RecommendedOpportunitiesProps {
  opportunities: ResultsOpportunity[];
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

      {opportunities.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("opportunities.noResults")}</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {opportunities.map((opportunity) => (
            <motion.div key={opportunity.businessTypeId} variants={itemVariants}>
              <Card className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                  <div>
                    <p className="font-display text-lg">{opportunity.name}</p>
                    {opportunity.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{opportunity.description}</p>
                    )}
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
                    {t("opportunities.budgetLabel")}: {formatEuros(opportunity.budgetMin)} –{" "}
                    {formatEuros(opportunity.budgetMax)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {t("opportunities.monthlyRevenueLabel")}: {formatEuros(opportunity.monthlyRevenueMin)} –{" "}
                    {formatEuros(opportunity.monthlyRevenueMax)}
                  </p>

                  <Button variant="secondary" className="mt-auto" asChild>
                    <Link href={`/businesses/type/${opportunity.slug}`}>{t("opportunities.exploreButton")}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
