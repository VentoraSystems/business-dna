"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

/**
 * Real as of Phase 3: `strengths`/`weaknesses` are `MatchingDimension` keys
 * from the top-ranked `CompatibilityResult` (rawValue >= 0.7 / <= 0.3 — see
 * matching-engine's STRENGTH_THRESHOLD/WEAKNESS_THRESHOLD), rendered via
 * `assessment.results.dimensionLabels` — not the fixed 5-item narrative
 * vocabulary (`strategicVision`, `delegation`, etc.) this section used to
 * read from mock data, which had no real computed counterpart.
 */
interface StrengthsAndGrowthProps {
  strengths: MatchingDimension[];
  weaknesses: MatchingDimension[];
}

export function StrengthsAndGrowth({ strengths, weaknesses }: StrengthsAndGrowthProps) {
  const t = useTranslations("assessment.results");

  return (
    <section className="grid gap-6 sm:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-xl">{t("strengths.sectionTitle")}</h2>
          {strengths.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("strengths.empty")}</p>
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {strengths.map((dimension) => (
                <motion.li key={dimension} variants={itemVariants} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{t(`dimensionLabels.${dimension}`)}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-xl">{t("growth.sectionTitle")}</h2>
          {weaknesses.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("growth.empty")}</p>
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {weaknesses.map((dimension) => (
                <motion.li key={dimension} variants={itemVariants} className="flex items-start gap-2.5 text-sm">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                  <span>{t(`dimensionLabels.${dimension}`)}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
