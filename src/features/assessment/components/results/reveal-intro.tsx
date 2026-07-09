"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Section 1 — the opening beat of the results experience. Fades in first;
 * every section below it in results-placeholder.tsx staggers in after,
 * via the same container/item Framer Motion variants pattern already used
 * in dna-profile-cards.tsx etc., just applied at section granularity.
 */
export function RevealIntro() {
  const t = useTranslations("assessment.results");

  return (
    <div className="mx-auto max-w-2xl py-4 text-center">
      <h1 className="mb-3 text-4xl">{t("reveal.title")}</h1>
      <p className="text-muted-foreground">{t("reveal.subtitle")}</p>
    </div>
  );
}
