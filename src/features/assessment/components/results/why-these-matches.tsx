"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

/**
 * Real as of Phase 3: `dimensions` are the top-ranked match's real
 * `strengths` (same `MatchingDimension[]` StrengthsAndGrowth receives) —
 * not the 3 fixed narrative reasons this section used to read from mock
 * data, which had no real computed counterpart.
 */
interface WhyTheseMatchesProps {
  dimensions: MatchingDimension[];
}

export function WhyTheseMatches({ dimensions }: WhyTheseMatchesProps) {
  const t = useTranslations("assessment.results");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl">{t("whyTheseMatches.sectionTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("whyTheseMatches.body")}</p>
          {dimensions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("whyTheseMatches.empty")}</p>
          ) : (
            <ul className="space-y-2.5">
              {dimensions.map((dimension) => (
                <li key={dimension} className="flex items-start gap-2.5 text-sm">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                  <span>
                    {t("whyTheseMatches.reasonTemplate", { dimension: t(`dimensionLabels.${dimension}`) })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
