"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { DnaResultsHero } from "./results/dna-results-hero";
import { DnaProfileCards } from "./results/dna-profile-cards";
import { StrengthsAndGrowth } from "./results/strengths-and-growth";
import { WorkStyleCards } from "./results/work-style-cards";
import { RecommendedOpportunities } from "./results/recommended-opportunities";
import { WhyTheseMatches } from "./results/why-these-matches";
import { WHY_MATCH_REASON_IDS } from "./results/config";
import { MOCK_DNA_RESULTS } from "./results/mock-data";

/**
 * The full "Entrepreneur DNA Results" experience. Everything here reads
 * from `MOCK_DNA_RESULTS` — a placeholder object, not the Matching Engine
 * — until real assessment scoring and business matching exist.
 */
export function ResultsPlaceholder() {
  const t = useTranslations("assessment.results");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 pb-16">
      <DnaResultsHero
        primaryArchetype={MOCK_DNA_RESULTS.primaryArchetype}
        compatibilityScore={MOCK_DNA_RESULTS.compatibilityScore}
        confidenceScore={MOCK_DNA_RESULTS.confidenceScore}
      />

      <DnaProfileCards profile={MOCK_DNA_RESULTS.dnaProfile} />

      <StrengthsAndGrowth
        strengths={MOCK_DNA_RESULTS.strengths}
        growthOpportunities={MOCK_DNA_RESULTS.growthOpportunities}
      />

      <WorkStyleCards workStyle={MOCK_DNA_RESULTS.workStyle} />

      <RecommendedOpportunities opportunities={MOCK_DNA_RESULTS.opportunities} />

      <WhyTheseMatches reasons={[...WHY_MATCH_REASON_IDS]} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex justify-center"
      >
        <Button size="lg" asChild>
          <Link href="/dashboard">{t("cta.continueButton")}</Link>
        </Button>
      </motion.div>
    </div>
  );
}
