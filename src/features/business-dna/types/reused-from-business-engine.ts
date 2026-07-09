/**
 * Reused from business-engine, via the ordinary `@/features/*` alias
 * (no long relative path concern here — business-engine already lives
 * under `src/`, unlike business-library). See ./resources.ts for how
 * `ResourceType` cross-references this feature's own
 * `BusinessDnaResourceCategory` — which, as of the Architecture
 * Reconciliation sprint, is itself now a subset of `features/resources`'
 * canonical 16-category vocabulary. `ResourceType` stays independent
 * (it mirrors a Prisma-backed database enum — see
 * `business-engine/schemas/enums.ts`'s docstring for why its values
 * weren't also unified onto `features/resources`).
 */
export { resourceTypeSchema, type ResourceType } from "@/features/business-engine/schemas/enums";
