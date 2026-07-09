import type { LucideIcon } from "lucide-react";
import {
  Hammer,
  Telescope,
  Settings2,
  Palette,
  Megaphone,
  Users,
  BarChart3,
  Gauge,
  Flag,
  MessageCircle,
  Cpu,
  Lightbulb,
  Zap,
  Briefcase,
  Clock,
} from "lucide-react";
import { MatchingDimension } from "@/features/matching-engine/scoring/dimensions";

/**
 * The 7 DNA archetype cards on this results page are a distinct,
 * page-scoped concept from `founderArchetypeSchema` in
 * business-library/schema.ts (theBuilder, theConnector, theOperator,
 * theVisionary, theSpecialist, theHustler). That schema is a separate,
 * already-finalized standard used by the Business Genome Library and is
 * intentionally left untouched here — these keys are not meant to line up
 * 1:1 with it.
 */
export type DnaArchetypeKey =
  | "builder"
  | "visionary"
  | "operator"
  | "creator"
  | "seller"
  | "leader"
  | "analyst";

export const DNA_ARCHETYPE_KEYS: readonly DnaArchetypeKey[] = [
  "builder",
  "visionary",
  "operator",
  "creator",
  "seller",
  "leader",
  "analyst",
];

export const DNA_ARCHETYPE_ICONS: Record<DnaArchetypeKey, LucideIcon> = {
  builder: Hammer,
  visionary: Telescope,
  operator: Settings2,
  creator: Palette,
  seller: Megaphone,
  leader: Users,
  analyst: BarChart3,
};

/**
 * Work Style dimensions that already exist as a `MatchingDimension`.
 * Reused as-is (same string keys) so this page never invents a second
 * vocabulary for a concept the matching engine already scores.
 *
 * `automationAffinity` does not currently exist in `MatchingDimension`
 * (see src/features/matching-engine/scoring/dimensions.ts) even though it
 * was expected to — it's treated as a local-only key below alongside
 * `businessExperience` and `timeAvailability`, not added to the enum.
 */
export type LocalWorkStyleKey = "automationAffinity" | "businessExperience" | "timeAvailability";

export type WorkStyleKey =
  | MatchingDimension.Risk
  | MatchingDimension.Leadership
  | MatchingDimension.CommunicationStyle
  | MatchingDimension.TechnicalAbility
  | MatchingDimension.Creativity
  | LocalWorkStyleKey;

export const WORK_STYLE_KEYS: readonly WorkStyleKey[] = [
  MatchingDimension.Risk,
  MatchingDimension.Leadership,
  MatchingDimension.CommunicationStyle,
  MatchingDimension.TechnicalAbility,
  MatchingDimension.Creativity,
  "automationAffinity",
  "businessExperience",
  "timeAvailability",
];

export const WORK_STYLE_ICONS: Record<WorkStyleKey, LucideIcon> = {
  [MatchingDimension.Risk]: Gauge,
  [MatchingDimension.Leadership]: Flag,
  [MatchingDimension.CommunicationStyle]: MessageCircle,
  [MatchingDimension.TechnicalAbility]: Cpu,
  [MatchingDimension.Creativity]: Lightbulb,
  automationAffinity: Zap,
  businessExperience: Briefcase,
  timeAvailability: Clock,
};

export type DifficultyLevel = "low" | "medium" | "high";
export type ScalabilityLevel = "low" | "medium" | "high";
export type RevenueSpeed = "slow" | "moderate" | "fast";

export const STRENGTH_IDS = [
  "strategicVision",
  "adaptability",
  "riskAppetite",
  "clearCommunication",
  "fastLearning",
] as const;

export const GROWTH_OPPORTUNITY_IDS = [
  "delegation",
  "financialDiscipline",
  "technicalDepth",
  "consistentExecution",
  "networkBuilding",
] as const;

export const OPPORTUNITY_SAMPLE_IDS = ["sample1", "sample2", "sample3"] as const;

export const WHY_MATCH_REASON_IDS = ["reason1", "reason2", "reason3"] as const;
