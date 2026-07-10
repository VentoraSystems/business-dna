"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import { OVERARCHING_ARCHETYPE_ICONS, type OverarchingArchetypeKey } from "./config";

interface DnaCertificateProps {
  /** Optional — see DnaResultsHeroProps.primaryArchetype for why this can be absent in v1. */
  overarchingArchetype?: OverarchingArchetypeKey;
  overallScore: number;
}

/**
 * Section 10 — an elegant, printable-looking summary card, not a real
 * document. "Download Certificate" is a placeholder action only — no PDF
 * generation exists. It reuses the same lightweight inline-message pattern
 * already used for feedback elsewhere (see
 * src/features/settings/components/profile-form.tsx's `success` state)
 * instead of introducing a toast library for one button.
 */
export function DnaCertificate({ overarchingArchetype, overallScore }: DnaCertificateProps) {
  const { user } = useUser();
  const locale = useLocale() as Locale;
  const t = useTranslations("assessment.results");
  const [showDownloadNotice, setShowDownloadNotice] = React.useState(false);
  const ArchetypeIcon = overarchingArchetype ? OVERARCHING_ARCHETYPE_ICONS[overarchingArchetype] : null;

  const displayName =
    user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || t("certificate.fallbackName");

  const analysisDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date());

  function handleDownload() {
    setShowDownloadNotice(true);
    setTimeout(() => setShowDownloadNotice(false), 3000);
  }

  return (
    <Card className="border-2 border-accent/30">
      <CardContent className="flex flex-col items-center gap-6 px-8 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-primary text-primary-foreground">
          <Award className="h-8 w-8" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t("certificate.eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-3xl">{t("certificate.title")}</h2>
        </div>

        <div className="h-px w-24 bg-border" />

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("certificate.nameLabel")}
          </p>
          <p className="font-display text-2xl">{displayName}</p>
        </div>

        <div className="grid w-full max-w-sm grid-cols-2 gap-6 text-left sm:grid-cols-3">
          {overarchingArchetype && ArchetypeIcon && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {t("certificate.archetypeLabel")}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <ArchetypeIcon className="h-4 w-4 text-accent-foreground" />
                <p className="text-sm font-semibold">
                  {t(`primaryArchetype.archetypes.${overarchingArchetype}.title`)}
                </p>
              </div>
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("certificate.scoreLabel")}
            </p>
            <p className="mt-1 text-sm font-semibold">{overallScore}%</p>
          </div>
          <div className={overarchingArchetype ? "col-span-2 sm:col-span-1" : undefined}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("certificate.dateLabel")}
            </p>
            <p className="mt-1 text-sm font-semibold">{analysisDate}</p>
          </div>
        </div>

        <Button onClick={handleDownload} className="gap-1.5">
          <Download className="h-4 w-4" />
          {t("certificate.downloadButton")}
        </Button>
        {showDownloadNotice && (
          <p className="text-xs text-muted-foreground">{t("certificate.downloadNotice")}</p>
        )}
      </CardContent>
    </Card>
  );
}
