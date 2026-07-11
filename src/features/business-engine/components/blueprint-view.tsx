"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requestBlueprintGeneration } from "@/features/business-engine/actions/request-blueprint-generation";
import { getBlueprintStatus } from "@/features/business-engine/actions/blueprint-status";
import type { BlueprintContent } from "@/features/business-engine/schemas/blueprint-content";
import type { BlueprintStatus } from "@prisma/client";

/** Within Part 2's ~8-20s expected latency range. */
const POLL_INTERVAL_MS = 2500;

const PLAIN_STRING_SECTION_KEYS = [
  "executiveSummary",
  "businessDescription",
  "targetAudience",
  "marketAnalysis",
  "competitorAnalysis",
  "marketingPlan",
  "salesStrategy",
  "financialForecast",
  "operations",
  "launchPlan",
  "growthPlan",
  "riskAnalysis",
  "exitStrategy",
] as const;

const SWOT_KEYS = ["strengths", "weaknesses", "opportunities", "threats"] as const;

const CANVAS_KEYS = [
  "keyPartners",
  "keyActivities",
  "keyResources",
  "valuePropositions",
  "customerRelationships",
  "channels",
  "customerSegments",
  "costStructure",
  "revenueStreams",
] as const;

interface BlueprintViewProps {
  businessId: string;
  initialStatus: BlueprintStatus | "none";
  initialContent: BlueprintContent | null;
  initialError: string | null;
}

export function BlueprintView({ businessId, initialStatus, initialContent, initialError }: BlueprintViewProps) {
  const [status, setStatus] = React.useState<BlueprintStatus | "none">(initialStatus);
  const [content, setContent] = React.useState<BlueprintContent | null>(initialContent);
  const [error, setError] = React.useState<string | null>(initialError);
  const [isStarting, setIsStarting] = React.useState(false);

  async function start() {
    setIsStarting(true);
    try {
      await requestBlueprintGeneration(businessId);
      setStatus("generating");
      setError(null);
    } finally {
      setIsStarting(false);
    }
  }

  // Polls while — and only while — generation is in flight. The effect re-subscribes
  // on every status change, so a terminal status (ready/failed) naturally stops polling
  // on the next render, and the returned cleanup clears the interval on unmount too.
  React.useEffect(() => {
    if (status !== "generating") return;
    let cancelled = false;
    const interval = setInterval(async () => {
      const result = await getBlueprintStatus(businessId);
      if (cancelled || !result) return;
      if (result.status !== "generating") {
        setStatus(result.status);
        setContent(result.content);
        setError(result.error);
      }
    }, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status, businessId]);

  if (status === "none") {
    return <EmptyBlueprintState onGenerate={start} isStarting={isStarting} />;
  }
  if (status === "generating") {
    return <GeneratingState />;
  }
  if (status === "failed") {
    return <FailedState error={error} onRetry={start} isRetrying={isStarting} />;
  }
  if (status === "ready" && content) {
    return <ReadyState content={content} />;
  }
  // "ready" with no valid content (shouldn't happen — see getBlueprintStatus's schema-mismatch fallback) — treat like a failure.
  return <FailedState error={error} onRetry={start} isRetrying={isStarting} />;
}

function EmptyBlueprintState({ onGenerate, isStarting }: { onGenerate: () => void; isStarting: boolean }) {
  const t = useTranslations("blueprint");
  const tButtons = useTranslations("buttons");
  const tCommon = useTranslations("common");
  return (
    <EmptyState
      icon={FileText}
      title={t("title")}
      description={t("emptyDescription")}
      action={
        <Button onClick={onGenerate} disabled={isStarting}>
          {isStarting ? tCommon("loading") : tButtons("generatePlan")}
        </Button>
      }
    />
  );
}

function GeneratingState() {
  const t = useTranslations("blueprint.generating");
  const messages = t.raw("messages") as string[];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIndex((i) => Math.min(i + 1, messages.length - 1)), 3000);
    return () => clearTimeout(timeout);
  }, [index, messages.length]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        className="mb-8 h-14 w-14 rounded-full border-2 border-border border-t-accent"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={messages[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mb-2 font-display text-xl"
        >
          {messages[index]}
        </motion.p>
      </AnimatePresence>
      <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
    </div>
  );
}

function FailedState({ error, onRetry, isRetrying }: { error: string | null; onRetry: () => void; isRetrying: boolean }) {
  const t = useTranslations("blueprint.failed");
  const tCommon = useTranslations("common");
  return (
    <EmptyState
      icon={AlertCircle}
      title={t("title")}
      description={error || t("description")}
      action={
        <Button onClick={onRetry} disabled={isRetrying}>
          {tCommon("retry")}
        </Button>
      }
    />
  );
}

function ReadyState({ content }: { content: BlueprintContent }) {
  const t = useTranslations("blueprint");
  return (
    <div className="space-y-6">
      {PLAIN_STRING_SECTION_KEYS.map((key) => (
        <section key={key} id={key}>
          <Card>
            <CardContent className="py-5">
              <h2 className="mb-2 text-lg font-semibold">{t(`sections.${key}`)}</h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{content[key]}</p>
            </CardContent>
          </Card>
        </section>
      ))}

      <section id="swot">
        <h2 className="mb-2 text-lg font-semibold">{t("sections.swot")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SWOT_KEYS.map((key) => (
            <Card key={key}>
              <CardContent className="py-5">
                <h3 className="mb-2 text-sm font-semibold">{t(`swot.${key}`)}</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {content.swot[key].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="businessModelCanvas">
        <h2 className="mb-2 text-lg font-semibold">{t("sections.businessModelCanvas")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CANVAS_KEYS.map((key) => (
            <Card key={key}>
              <CardContent className="py-5">
                <h3 className="mb-2 text-sm font-semibold">{t(`canvas.${key}`)}</h3>
                <p className="text-sm text-muted-foreground">{content.businessModelCanvas[key]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
