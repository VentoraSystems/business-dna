import type { Blueprint } from "../types/blueprint";

/** Input to create a new Blueprint — authored whole, all 25 sections (plus internal-only aiMetadata) required, same pattern as features/business-dna's CreateDto. */
export type BlueprintCreateDto = Blueprint;
