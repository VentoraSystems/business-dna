"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requestSectionGeneration } from "@/features/business-engine/actions/request-section-generation";
import { getSectionStatus } from "@/features/business-engine/actions/section-status";
import type { BlueprintSectionKey } from "@/features/business-engine/actions/request-section-generation";
import type { BlueprintStatus } from "@prisma/client";

/** Within the ~8-20s expected latency range for a real generation call. */
const POLL_INTERVAL_MS = 2500;

interface SectionViewProps {
  businessId: string;
  sectionKey: BlueprintSectionKey;
  initialStatus: BlueprintStatus | "none";
  initialContent: unknown;
  initialError: string | null;
}

/**
 * Per-section state machine — same shape as the old whole-document
 * BlueprintView, scoped to one section. Visiting an already-"ready"
 * section never re-triggers generation: the page passes that section's
 * real persisted status as `initialStatus`, and generation is only ever
 * triggered by the user clicking "Generate" from the "none"/"failed"
 * states below.
 */
export function SectionView({ businessId, sectionKey, initialStatus, initialContent, initialError }: SectionViewProps) {
  const [status, setStatus] = React.useState<BlueprintStatus | "none">(initialStatus);
  const [content, setContent] = React.useState<unknown>(initialContent);
  const [error, setError] = React.useState<string | null>(initialError);
  const [isStarting, setIsStarting] = React.useState(false);

  async function start() {
    setIsStarting(true);
    try {
      await requestSectionGeneration(businessId, sectionKey);
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
      const result = await getSectionStatus(businessId, sectionKey);
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
  }, [status, businessId, sectionKey]);

  if (status === "none") {
    return <EmptySectionState onGenerate={start} isStarting={isStarting} />;
  }
  if (status === "generating") {
    return <GeneratingSection />;
  }
  if (status === "failed") {
    return <FailedSection error={error} onRetry={start} isRetrying={isStarting} />;
  }
  if (status === "ready") {
    return <ReadySection content={content} />;
  }
  return <FailedSection error={error} onRetry={start} isRetrying={isStarting} />;
}

function EmptySectionState({ onGenerate, isStarting }: { onGenerate: () => void; isStarting: boolean }) {
  const t = useTranslations("blueprint");
  const tButtons = useTranslations("buttons");
  const tCommon = useTranslations("common");
  return (
    <EmptyState
      icon={FileText}
      title={t("status.none")}
      description={t("emptyDescription")}
      action={
        <Button onClick={onGenerate} disabled={isStarting}>
          {isStarting ? tCommon("loading") : tButtons("generatePlan")}
        </Button>
      }
    />
  );
}

function GeneratingSection() {
  const t = useTranslations("blueprint.generating");
  const messages = t.raw("messages") as string[];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIndex((i) => Math.min(i + 1, messages.length - 1)), 3000);
    return () => clearTimeout(timeout);
  }, [index, messages.length]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
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

function FailedSection({ error, onRetry, isRetrying }: { error: string | null; onRetry: () => void; isRetrying: boolean }) {
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

/**
 * Content shape isn't fixed yet — this phase's generator is a stub
 * ({ body: string }), and a later phase defines the real per-section
 * shape. Rendered generically (non-muted, readable body text, carrying
 * forward the earlier visual-hierarchy fix) rather than assuming a
 * specific structure that doesn't exist yet.
 */
function ReadySection({ content }: { content: unknown }) {
  const body =
    content && typeof content === "object" && "body" in content && typeof (content as { body: unknown }).body === "string"
      ? (content as { body: string }).body
      : JSON.stringify(content, null, 2);

  return (
    <Card>
      <CardContent className="py-6">
        <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
