"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { RevealIntro } from "./results/reveal-intro";
import { DnaResultsHero } from "./results/dna-results-hero";
import { PrimaryArchetypeCard } from "./results/primary-archetype-card";
import { DnaProfileCards } from "./results/dna-profile-cards";
import { StrengthsAndGrowth } from "./results/strengths-and-growth";
import { WorkStyleCards } from "./results/work-style-cards";
import { RecommendedOpportunities } from "./results/recommended-opportunities";
import { WhyTheseMatches } from "./results/why-these-matches";
import { DnaCertificate } from "./results/dna-certificate";
import { WHY_MATCH_REASON_IDS } from "./results/config";
import { MOCK_DNA_RESULTS } from "./results/mock-data";

/**
 * Section-level reveal, mirroring the card-level stagger pattern already
 * used in dna-profile-cards.tsx / work-style-cards.tsx / etc. — just
 * applied to whole sections instead of individual cards, so "Reveal" fades
 * in first and everything below cascades in after it, one section at a
 * time, instead of appearing all at once.
 */
const sectionContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const sectionItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * The full "Entrepreneur DNA Results" experience. Everything here reads
 * from `MOCK_DNA_RESULTS` — a placeholder object, not the Matching Engine
 * — until real assessment scoring and business matching exist.
 *
 * Eleven sections, in order: Reveal, DNA Score, Primary Archetype, DNA
 * Profile, Strengths + Growth Opportunities, Work Style, Best
 * Opportunities, Why These Fit, Certificate, Mission Control CTA.
 */
export function ResultsPlaceholder() {
  const t = useTranslations("assessment.results");

  return (
    <motion.div
      variants={sectionContainerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-5xl flex-col gap-16 pb-16"
    >
      {/* 1. Reveal */}
      <motion.div variants={sectionItemVariants}>
        <RevealIntro />
      </motion.div>

      {/* 2. DNA Score */}
      <motion.div variants={sectionItemVariants}>
        <DnaResultsHero
          primaryArchetype={MOCK_DNA_RESULTS.primaryArchetype}
          compatibilityScore={MOCK_DNA_RESULTS.compatibilityScore}
          confidenceScore={MOCK_DNA_RESULTS.confidenceScore}
        />
      </motion.div>

      {/* 3. Primary Archetype */}
      <motion.div variants={sectionItemVariants}>
        <PrimaryArchetypeCard overarchingArchetype={MOCK_DNA_RESULTS.overarchingArchetype} />
      </motion.div>

      {/* 4. DNA Profile */}
      <motion.div variants={sectionItemVariants}>
        <DnaProfileCards profile={MOCK_DNA_RESULTS.dnaProfile} />
      </motion.div>

      {/* 5-6. Strengths + Growth Opportunities */}
      <motion.div variants={sectionItemVariants}>
        <StrengthsAndGrowth
          strengths={MOCK_DNA_RESULTS.strengths}
          growthOpportunities={MOCK_DNA_RESULTS.growthOpportunities}
        />
      </motion.div>

      {/* 7. Work Style */}
      <motion.div variants={sectionItemVariants}>
        <WorkStyleCards workStyle={MOCK_DNA_RESULTS.workStyle} />
      </motion.div>

      {/* 8. Best Opportunities */}
      <motion.div variants={sectionItemVariants}>
        <RecommendedOpportunities opportunities={MOCK_DNA_RESULTS.opportunities} />
      </motion.div>

      {/* 9. Why These Fit */}
      <motion.div variants={sectionItemVariants}>
        <WhyTheseMatches reasons={[...WHY_MATCH_REASON_IDS]} />
      </motion.div>

      {/* 10. Certificate */}
      <motion.div variants={sectionItemVariants}>
        <DnaCertificate
          overarchingArchetype={MOCK_DNA_RESULTS.overarchingArchetype}
          overallScore={MOCK_DNA_RESULTS.compatibilityScore}
        />
      </motion.div>

      {/* 11. Mission Control CTA */}
      <motion.div variants={sectionItemVariants} className="flex justify-center">
        <Button size="lg" asChild>
          <Link href="/dashboard">{t("cta.continueButton")}</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
