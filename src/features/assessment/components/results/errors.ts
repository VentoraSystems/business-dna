/**
 * Thrown by the not-yet-implemented parts of this results page (currently
 * just `deriveOverarchingArchetype()` — see ./derive-overarching-archetype.ts).
 * Mirrors `business-dna/utils/errors.ts`, `matching-engine/utils/errors.ts`,
 * and `explanation-engine/utils/errors.ts` in shape and intent, but is its
 * own class (not imported across features) so this feature never takes on
 * a dependency direction toward any of them just for error handling.
 */
export class NotImplementedError extends Error {
  readonly stage: string;

  constructor(stage: string, detail?: string) {
    super(
      `[assessment/results] "${stage}" has no implementation yet — this is architecture only.` +
        (detail ? ` ${detail}` : "")
    );
    this.name = "NotImplementedError";
    this.stage = stage;
  }
}
