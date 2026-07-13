/**
 * Roadmap engagement layer Part 1 — surprise bonus XP. A small, genuinely
 * random chance of a little extra XP on top of the normal xpValue,
 * whenever ANY RoadmapTask or DailyAction is completed. Pure function, no
 * "server-only" import needed (nothing here touches the DB or Prisma) —
 * both toggleTaskCompletion() and completeDailyAction() call this and add
 * the result directly to Roadmap.totalXp themselves.
 *
 * Deliberately NOT persisted as its own record (no BonusXpAward table or
 * similar): once awarded, bonus XP is just more totalXp, indistinguishable
 * from the base xpValue that triggered it. This keeps this phase's schema
 * minimal, at one explicit cost worth stating: un-completing a task (or,
 * hypothetically, a day rolling over on a daily action) can't claw back a
 * bonus that completion may have triggered, since there's no record of
 * which completion caused which bonus. If a future phase wants an
 * auditable "Bonus XP" history or a per-award display list, that would
 * need a dedicated table — not needed for this phase, which only needs
 * the caller to know "a bonus fired, by how much" for a single moment of
 * UI feedback.
 */
const BONUS_XP_CHANCE = 0.15;
const BONUS_XP_MIN = 5;
const BONUS_XP_MAX = 15;

/** Returns 0 when no bonus fires (not null) — callers can always safely do `xpValue + rollBonusXp()`. */
export function rollBonusXp(): number {
  if (Math.random() >= BONUS_XP_CHANCE) return 0;
  return BONUS_XP_MIN + Math.floor(Math.random() * (BONUS_XP_MAX - BONUS_XP_MIN + 1));
}
