/**
 * Blueprint Generation Part 3 verification script — not a test, not part
 * of the app. Exercises getBlueprintStatus() (the new read path the
 * polling UI calls) against real Blueprint rows in each of the 4 states
 * the UI branches on: none/generating/ready/failed — using the same
 * underlying logic the action calls, since the action itself is gated
 * behind requireCurrentUser() (Clerk), which has no meaning outside a
 * real request — same rationale as every other *-check.ts script in this
 * directory.
 *
 * IMPORTANT — this sandbox cannot render the actual UI in a browser: no
 * Clerk keys are configured (`.env` has no CLERK_* vars), so
 * ClerkProvider throws on every single route in this app at runtime
 * (confirmed: `curl localhost:3000/en/blueprint` -> 500, "Missing
 * publishableKey" — this is a pre-existing, app-wide sandbox limitation
 * that predates this change and applies to every page, not something
 * introduced here). This script instead proves the DATA each UI state
 * receives is correct; blueprint-view.tsx's render branching is a plain
 * if/else chain on `status` verified by code inspection in the report.
 *
 * Run with `npm run blueprint-status:check`.
 */
import { randomUUID } from "node:crypto";
import { db } from "../src/lib/db";
import { blueprintContentSchema, type BlueprintContent } from "../src/features/business-engine/schemas/blueprint-content";

/** Mirrors getBlueprintStatus() exactly (see src/features/business-engine/actions/blueprint-status.ts), minus the requireCurrentUser() call this script can't satisfy outside a real request. */
async function getBlueprintStatusForUser(userId: string, businessId: string) {
  const business = await db.business.findUnique({ where: { id: businessId } });
  if (!business || business.userId !== userId) throw new Error("BUSINESS_NOT_FOUND");

  const blueprint = await db.blueprint.findUnique({ where: { businessId } });
  if (!blueprint) return null;

  if (blueprint.status !== "ready") {
    return { status: blueprint.status, content: null as BlueprintContent | null, error: blueprint.error };
  }
  const parsed = blueprintContentSchema.safeParse(blueprint.content);
  return {
    status: blueprint.status,
    content: parsed.success ? parsed.data : null,
    error: parsed.success ? null : "Stored content did not match the expected shape.",
  };
}

function mockReadyContent(): BlueprintContent {
  return {
    executiveSummary: "Mock executive summary for UI-state verification.",
    businessDescription: "Mock business description.",
    targetAudience: "Mock target audience.",
    marketAnalysis: "Mock market analysis.",
    competitorAnalysis: "Mock competitor analysis.",
    swot: {
      strengths: ["Mock strength 1", "Mock strength 2"],
      weaknesses: ["Mock weakness 1"],
      opportunities: ["Mock opportunity 1"],
      threats: ["Mock threat 1"],
    },
    businessModelCanvas: {
      keyPartners: "Mock key partners.",
      keyActivities: "Mock key activities.",
      keyResources: "Mock key resources.",
      valuePropositions: "Mock value propositions.",
      customerRelationships: "Mock customer relationships.",
      channels: "Mock channels.",
      customerSegments: "Mock customer segments.",
      costStructure: "Mock cost structure.",
      revenueStreams: "Mock revenue streams.",
    },
    marketingPlan: "Mock marketing plan.",
    salesStrategy: "Mock sales strategy.",
    financialForecast: "Mock financial forecast.",
    operations: "Mock operations.",
    launchPlan: "Mock launch plan.",
    growthPlan: "Mock growth plan.",
    riskAnalysis: "Mock risk analysis.",
    exitStrategy: "Mock exit strategy.",
  };
}

async function main() {
  console.log("=== Setup: throwaway User + Business (no Blueprint row yet) ===");
  const user = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "en" },
  });
  const businessType = await db.businessType.findFirstOrThrow({ where: { slug: "software-house" } });
  const business = await db.business.create({
    data: { userId: user.id, businessTypeId: businessType.id, name: "Test Adopted Business" },
  });
  console.log(`Created Business ${business.id}`);

  console.log("\n=== State 1: 'none' — no Blueprint row exists ===");
  const stateNone = await getBlueprintStatusForUser(user.id, business.id);
  console.log("getBlueprintStatus() ->", stateNone);
  if (stateNone !== null) throw new Error("Expected null when no Blueprint row exists!");
  console.log("=> BlueprintView receives initialStatus='none' -> renders EmptyBlueprintState (Generate CTA).");

  console.log("\n=== State 2: 'generating' ===");
  const blueprint = await db.blueprint.create({
    data: { businessId: business.id, locale: "en", status: "generating", content: {} },
  });
  const stateGenerating = await getBlueprintStatusForUser(user.id, business.id);
  console.log("getBlueprintStatus() ->", stateGenerating);
  if (stateGenerating?.status !== "generating") throw new Error("Expected status 'generating'!");
  if (stateGenerating.content !== null) throw new Error("Expected content=null while generating!");
  console.log("=> BlueprintView receives status='generating' -> renders GeneratingState (spinner + cycling messages, polling every 2500ms).");

  console.log("\n=== State 3: 'ready' ===");
  await db.blueprint.update({
    where: { id: blueprint.id },
    data: { status: "ready", error: null, content: mockReadyContent() as object },
  });
  const stateReady = await getBlueprintStatusForUser(user.id, business.id);
  console.log("getBlueprintStatus() -> status:", stateReady?.status, "| error:", stateReady?.error);
  if (stateReady?.status !== "ready") throw new Error("Expected status 'ready'!");
  if (!stateReady.content) throw new Error("Expected non-null content when ready!");
  blueprintContentSchema.parse(stateReady.content); // re-validate the exact object the UI would receive
  console.log("Content keys:", Object.keys(stateReady.content).length, "(expected 15)");
  console.log("swot keys:", Object.keys(stateReady.content.swot));
  console.log("businessModelCanvas keys:", Object.keys(stateReady.content.businessModelCanvas));
  console.log(
    "=> BlueprintView receives status='ready' + valid content -> renders ReadyState: 13 prose Cards + a 4-column SWOT grid + a 9-block canvas grid."
  );

  console.log("\n=== State 4: 'failed' ===");
  await db.blueprint.update({
    where: { id: blueprint.id },
    data: { status: "failed", error: "OpenAI request failed: 403 Host not in allowlist: api.openai.com." },
  });
  const stateFailed = await getBlueprintStatusForUser(user.id, business.id);
  console.log("getBlueprintStatus() ->", stateFailed);
  if (stateFailed?.status !== "failed") throw new Error("Expected status 'failed'!");
  if (!stateFailed.error) throw new Error("Expected a non-empty error message!");
  console.log("=> BlueprintView receives status='failed' -> renders FailedState (error message + 'Try again' button re-calling requestBlueprintGeneration).");

  console.log("\n=== Ownership check: a different user cannot read this Business's Blueprint status ===");
  const otherUser = await db.user.create({
    data: { clerkId: `test_${randomUUID()}`, email: `test-${randomUUID()}@example.com`, locale: "en" },
  });
  let ownershipEnforced = false;
  try {
    await getBlueprintStatusForUser(otherUser.id, business.id);
  } catch (error) {
    ownershipEnforced = error instanceof Error && error.message === "BUSINESS_NOT_FOUND";
  }
  console.log(`Ownership enforced: ${ownershipEnforced}`);
  if (!ownershipEnforced) throw new Error("A different user was able to read this Business's Blueprint status!");
  await db.user.delete({ where: { id: otherUser.id } });

  console.log("\n=== Cleanup ===");
  await db.blueprint.deleteMany({ where: { businessId: business.id } });
  await db.business.delete({ where: { id: business.id } });
  await db.user.delete({ where: { id: user.id } });
  console.log("Removed throwaway test data.");

  console.log("\n✅ All blueprint-status UI-state checks passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
