/**
 * Reused from business-engine, via the ordinary `@/features/*` alias
 * (no long relative path concern here — business-engine already lives
 * under `src/`, unlike business-library). See ./resources.ts for how
 * `ResourceType` cross-references this feature's own, broader
 * `BusinessDnaResourceCategory`.
 */
export { resourceTypeSchema, type ResourceType } from "@/features/business-engine/schemas/enums";
