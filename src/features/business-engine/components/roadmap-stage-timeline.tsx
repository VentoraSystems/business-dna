"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ROADMAP_STAGE_ORDER, type RoadmapStageKey } from "@/features/roadmap/types/sections";
import type { RoadmapStageView } from "@/features/business-engine/actions/roadmap-view";

interface RoadmapStageTimelineProps {
  stages: RoadmapStageView[];
}

/**
 * Horizontal scrolling stepper, not a vertical stacked one: the per-stage
 * checklist below already renders every stage as its own full-width Card,
 * so a vertical 10-item stepper would just be a second copy of the same
 * list stacked above it — wasted vertical space on a phone-sized viewport.
 * A horizontal strip keeps the whole 10-stage overview to one fixed-height
 * row near the top, and horizontal swipe/scroll is a native, discoverable
 * gesture on touch devices (unlike hover-dependent affordances).
 *
 * Interaction: tapping a node scrolls the matching stage Card into view
 * (id="stage-{key}", smooth scroll) rather than expanding/collapsing
 * anything — every stage's checklist is already rendered below, so
 * "expand" has nothing to reveal; "jump to it" is the only useful action.
 */
export function RoadmapStageTimeline({ stages }: RoadmapStageTimelineProps) {
  const t = useTranslations("roadmap.stages");

  function handleClick(stage: RoadmapStageKey) {
    document.getElementById(`stage-${stage}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="flex w-max items-center">
        {ROADMAP_STAGE_ORDER.map((stageKey, index) => {
          const stageView = stages.find((s) => s.stage === stageKey);
          const status = stageView?.status ?? "upcoming";
          const isLast = index === ROADMAP_STAGE_ORDER.length - 1;
          return (
            <React.Fragment key={stageKey}>
              <button
                type="button"
                onClick={() => handleClick(stageKey)}
                className="flex flex-col items-center gap-1.5 px-1 py-1 text-center"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                    status === "completed" && "border-accent bg-accent text-accent-foreground",
                    status === "inProgress" && "border-accent bg-accent/15 text-accent-foreground",
                    status === "upcoming" && "border-border bg-surface text-muted-foreground"
                  )}
                >
                  {status === "completed" ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                </span>
                <span className="w-16 text-[11px] leading-tight text-muted-foreground">{t(stageKey)}</span>
              </button>
              {!isLast && (
                <div
                  className={cn("mb-5 h-0.5 w-6 shrink-0", status === "completed" ? "bg-accent" : "bg-border")}
                  aria-hidden
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
