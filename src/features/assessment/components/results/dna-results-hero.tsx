"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { CompatibilityRing } from "./compatibility-ring";
import { DNA_ARCHETYPE_ICONS, type DnaArchetypeKey } from "./config";

interface DnaResultsHeroProps {
  primaryArchetype: DnaArchetypeKey;
  compatibilityScore: number;
  confidenceScore: number;
}

export function DnaResultsHero({
  primaryArchetype,
  compatibilityScore,
  confidenceScore,
}: DnaResultsHeroProps) {
  const t = useTranslations("assessment.results");
  const ArchetypeIcon = DNA_ARCHETYPE_ICONS[primaryArchetype];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-xl flex-col items-center py-4 text-center"
    >
      <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
        {t("hero.eyebrow")}
      </p>

      <CompatibilityRing
        score={compatibilityScore}
        size={192}
        strokeWidth={14}
        label={t("hero.matchLabel")}
        className="mb-8"
      />

      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
          <ArchetypeIcon className="h-5 w-5" />
        </div>
        <h1 className="text-3xl">{t(`dnaProfile.archetypes.${primaryArchetype}.name`)}</h1>
      </div>

      <Badge variant="accent" className="mb-5">
        {t("hero.confidenceValue", { value: confidenceScore })}
      </Badge>

      <p className="max-w-md text-muted-foreground">
        {t("hero.summary", { archetype: t(`dnaProfile.archetypes.${primaryArchetype}.name`) })}
      </p>
    </motion.div>
  );
}
