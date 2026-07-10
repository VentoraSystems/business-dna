"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { RevealIntro } from "./results/reveal-intro";
import { DnaResultsHero } from "./results/dna-results-hero";
import { StrengthsAndGrowth } from "./results/strengths-and-growth";
import { WorkStyleCards } from "./results/work-style-cards";
import { RecommendedOpportunities } from "./results/recommended-opportunities";
import { WhyTheseMatches } from "./results/why-these-matches";
import { DnaCertificate } from "./results/dna-certificate";
import { getAssessmentResults, type AssessmentResultsData } from "../actions/results-actions";

const sectionContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const sectionItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface ResultsPlaceholderProps {
  assessmentId: string;
}

/**
 * The "Entrepreneur DNA Results" experience. Real as of Phase 3 — reads
 * `getAssessmentResults()` (results-actions.ts), which returns what
 * `completeAssessmentSession()` persisted via the Matching Engine, rather
 * than the `MOCK_DNA_RESULTS` this used to render unconditionally.
 *
 * Two sections from the original 11 are not rendered here on purpose:
 * "Primary Archetype" and "DNA Profile" (the 7-founder-archetype cards)
 * both depend on `DnaArchetypeKey` scores that no phase has ever computed
 * — Phase 2 scores the 14 `MatchingDimension`s, a different vocabulary,
 * and there's no specified mapping from one to the other. Rather than
 * fabricate one, those two sections are omitted; `DnaResultsHero` and
 * `DnaCertificate` render their real score/confidence without a
 * fabricated archetype label (see their own `primaryArchetype`/
 * `overarchingArchetype` props, now optional). See
 * `results/derive-overarching-archetype.ts` for the one piece of that
 * chain (7-key scores -> 5-key headline) that *is* implemented, and its
 * doc comment for why it isn't wired in here.
 */
export function ResultsPlaceholder({ assessmentId }: ResultsPlaceholderProps) {
  const t = useTranslations("assessment.results");
  const tCommon = useTranslations("common");
  const [data, setData] = React.useState<AssessmentResultsData | null | undefined>(undefined);

  React.useEffect(() => {
    let cancelled = false;
    getAssessmentResults(assessmentId).then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  if (data === undefined) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 py-12">
        <Skeleton className="mx-auto h-48 w-48 rounded-full" />
        <Skeleton className="mx-auto h-6 w-64" />
        <Skeleton className="mx-auto h-4 w-80" />
      </div>
    );
  }

  if (data === null || data.opportunities.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <EmptyState
          icon={Sparkles}
          title={t("opportunities.sectionTitle")}
          description={t("opportunities.noResults")}
          action={
            <Button asChild>
              <Link href="/dashboard">{tCommon("continue")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

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
          compatibilityScore={data.overallScore}
          confidenceScore={Math.round(data.confidenceScore * 100)}
        />
      </motion.div>

      {/* 3. Strengths + Growth Opportunities */}
      <motion.div variants={sectionItemVariants}>
        <StrengthsAndGrowth strengths={data.strengths} weaknesses={data.weaknesses} />
      </motion.div>

      {/* 4. Work Style */}
      {data.workStyle.length > 0 && (
        <motion.div variants={sectionItemVariants}>
          <WorkStyleCards workStyle={data.workStyle} />
        </motion.div>
      )}

      {/* 5. Best Opportunities */}
      <motion.div variants={sectionItemVariants}>
        <RecommendedOpportunities opportunities={data.opportunities} />
      </motion.div>

      {/* 6. Why These Fit */}
      <motion.div variants={sectionItemVariants}>
        <WhyTheseMatches dimensions={data.strengths} />
      </motion.div>

      {/* 7. Certificate */}
      <motion.div variants={sectionItemVariants}>
        <DnaCertificate overallScore={data.overallScore} />
      </motion.div>

      {/* 8. Mission Control CTA */}
      <motion.div variants={sectionItemVariants} className="flex justify-center">
        <Button size="lg" asChild>
          <Link href="/dashboard">{t("cta.continueButton")}</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
