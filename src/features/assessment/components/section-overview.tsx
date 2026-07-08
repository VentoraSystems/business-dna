"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { assessmentSections } from "../config/sections";

interface SectionOverviewProps {
  currentSectionKey?: string;
  completedSectionKeys?: string[];
  onSelectSection?: (sectionKey: string) => void;
}

export function SectionOverview({
  currentSectionKey,
  completedSectionKeys = [],
  onSelectSection,
}: SectionOverviewProps) {
  const t = useTranslations("assessment.sections");

  return (
    <ol className="flex flex-col gap-1">
      {assessmentSections.map((section, index) => {
        const isCurrent = section.key === currentSectionKey;
        const isDone = completedSectionKeys.includes(section.key);
        const isInteractive = Boolean(onSelectSection) && isDone;

        return (
          <li key={section.key}>
            <button
              type="button"
              disabled={!isInteractive}
              onClick={() => isInteractive && onSelectSection?.(section.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                isCurrent && "bg-accent/10 font-semibold text-foreground",
                !isCurrent && "text-muted-foreground",
                isInteractive && "hover:bg-muted"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-border text-xs font-semibold",
                  isDone && "border-success bg-success text-success-foreground",
                  isCurrent && !isDone && "border-accent text-accent-foreground"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              {t(`${section.key}.title` as "aboutYou.title")}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
