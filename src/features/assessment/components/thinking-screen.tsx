"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

const MESSAGE_KEYS = [
  "analyzingPersonality",
  "findingMatches",
  "calculatingCompatibility",
  "buildingRoadmap",
  "generatingForecast",
  "preparingBlueprint",
] as const;

const MS_PER_MESSAGE = 900;

interface ThinkingScreenProps {
  onComplete: () => void;
}

export function ThinkingScreen({ onComplete }: ThinkingScreenProps) {
  const t = useTranslations("assessment.thinking");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (index >= MESSAGE_KEYS.length - 1) {
      const timeout = setTimeout(onComplete, MS_PER_MESSAGE);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setIndex((i) => i + 1), MS_PER_MESSAGE);
    return () => clearTimeout(timeout);
  }, [index, onComplete]);

  const progressPercent = 10 + (index / (MESSAGE_KEYS.length - 1)) * 85;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        className="mb-9 h-16 w-16 rounded-full border-2 border-border border-t-accent"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={MESSAGE_KEYS[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mb-2 font-display text-2xl"
        >
          {t(MESSAGE_KEYS[index])}
        </motion.p>
      </AnimatePresence>
      <p className="mb-8 text-sm text-muted-foreground">{t("subtext")}</p>
      <div className="h-1 w-64 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-accent"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
