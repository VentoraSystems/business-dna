"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DailyActionView } from "@/features/business-engine/actions/daily-actions";

interface RoadmapDailyActionsSectionProps {
  actions: DailyActionView[];
  pendingKeys: Set<string>;
  onComplete: (key: string) => void;
}

/**
 * Today's quick wins — deliberately visually distinct from the 10-stage
 * roadmap checklist below it (accent-tinted Card, not a plain one), since
 * these are generic daily engagement actions, not part of the structured
 * business journey (see DailyAction's schema comment — breaking down
 * roadmap.json's stage tasks into finer sub-steps is separate, out-of-
 * scope work).
 *
 * Layout: a 2-column grid (3 on wider screens), not a horizontal scroll.
 * Unlike the stage timeline (Part 3), which is a glanceable status strip
 * where hiding most items off-screen is fine, this is a checklist of 6
 * independent, actionable items a user is meant to scan and pick from —
 * a grid keeps every option visible at once on a phone-sized viewport
 * without requiring a swipe to discover the rest.
 */
export function RoadmapDailyActionsSection({ actions, pendingKeys, onComplete }: RoadmapDailyActionsSectionProps) {
  const t = useTranslations("roadmap");
  const tSection = useTranslations("roadmap.dailyActionsSection");

  if (actions.length === 0) return null;

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader>
        <CardTitle>{tSection("title")}</CardTitle>
        <CardDescription>{tSection("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {actions.map((action) => (
            <DailyActionCard
              key={action.key}
              action={action}
              pending={pendingKeys.has(action.key)}
              onComplete={() => onComplete(action.key)}
              xpLabel={t("xpValue", { value: action.xpValue })}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DailyActionCard({
  action,
  pending,
  onComplete,
  xpLabel,
}: {
  action: DailyActionView;
  pending: boolean;
  onComplete: () => void;
  xpLabel: string;
}) {
  const t = useTranslations();
  const title = t(`${action.translationKey}.title`);
  const description = t(`${action.translationKey}.description`);
  const done = action.completedToday;

  return (
    <button
      type="button"
      disabled={done || pending}
      onClick={onComplete}
      aria-label={title}
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors",
        done ? "border-border bg-muted/50 opacity-60" : "border-border bg-surface hover:border-accent cursor-pointer",
        pending && "opacity-70"
      )}
    >
      {/* Visual-only checkbox indicator — not the shared Checkbox component, since that
          renders its own <button> and this card is already the single tap target. */}
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-md border-2",
          done ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface text-transparent"
        )}
        aria-hidden
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <p className={cn("text-sm font-medium leading-tight", done ? "text-muted-foreground line-through" : "text-foreground")}>
        {title}
      </p>
      <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
      <span className="mt-auto text-[11px] font-semibold text-muted-foreground">{xpLabel}</span>
    </button>
  );
}
