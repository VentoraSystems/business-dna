"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { OVERARCHING_ARCHETYPE_ICONS, type OverarchingArchetypeKey } from "./config";

interface PrimaryArchetypeCardProps {
  overarchingArchetype: OverarchingArchetypeKey;
}

/**
 * Section 3 — "Primary Archetype". Deliberately distinct from
 * `DnaProfileCards` (the 7 Builder/Visionary/etc. cards): this is the one
 * overarching label the results page leads with, from its own
 * `OverarchingArchetypeKey` taxonomy — see ./config.ts for why the two
 * are kept separate.
 */
export function PrimaryArchetypeCard({ overarchingArchetype }: PrimaryArchetypeCardProps) {
  const t = useTranslations("assessment.results");
  const Icon = OVERARCHING_ARCHETYPE_ICONS[overarchingArchetype];

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-5 px-6 py-8 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("primaryArchetype.eyebrow")}
          </p>
          <h2 className="mb-2 font-display text-2xl">
            {t(`primaryArchetype.archetypes.${overarchingArchetype}.title`)}
          </h2>
          <p className="mb-3 text-sm text-muted-foreground">
            {t(`primaryArchetype.archetypes.${overarchingArchetype}.description`)}
          </p>
          <p className="text-sm">{t(`primaryArchetype.archetypes.${overarchingArchetype}.summary`)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
