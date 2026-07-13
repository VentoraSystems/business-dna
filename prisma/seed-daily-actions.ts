import { PrismaClient } from "@prisma/client";
import { DAILY_ACTION_KEYS } from "../src/features/roadmap/types/daily-actions";

/**
 * Seeds the small, fixed DailyAction catalog (Roadmap engagement layer
 * Part 1) — separate from seed-business-engine.ts on purpose: that seed
 * is scoped to content sourced from business-library/technology/*, while
 * DailyAction rows are generic, hand-authored copy with no per-business
 * source of truth. Upserts by `key`, so re-running this after editing
 * xpValue/translationKey below updates existing rows instead of erroring
 * on the unique constraint. Run with `npm run db:seed:daily-actions`.
 */
const db = new PrismaClient();

const DAILY_ACTION_XP_VALUE = 5;

const DAILY_ACTIONS = DAILY_ACTION_KEYS.map((key) => ({
  key,
  translationKey: `roadmap.dailyActions.${key}`,
  xpValue: DAILY_ACTION_XP_VALUE,
}));

async function main() {
  for (const action of DAILY_ACTIONS) {
    await db.dailyAction.upsert({
      where: { key: action.key },
      update: { translationKey: action.translationKey, xpValue: action.xpValue },
      create: action,
    });
  }
  console.log(`Daily action seed complete — ${DAILY_ACTIONS.length} DailyAction row(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
