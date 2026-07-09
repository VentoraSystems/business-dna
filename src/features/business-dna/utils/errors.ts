/**
 * Thrown by the not-yet-implemented parts of this feature (currently
 * just `fromBusinessGenome()` — see ./from-business-genome.ts). Mirrors
 * `matching-engine/utils/errors.ts` and `explanation-engine/utils/errors.ts`
 * in shape and intent, but is its own class (not imported across
 * features) so this feature never takes on a dependency direction toward
 * either just for error handling.
 */
export class NotImplementedError extends Error {
  readonly stage: string;

  constructor(stage: string, detail?: string) {
    super(
      `[business-dna] "${stage}" has no implementation yet — this is architecture only.` +
        (detail ? ` ${detail}` : "")
    );
    this.name = "NotImplementedError";
    this.stage = stage;
  }
}

/** Base class for errors that *do* represent a real (future) failure mode. */
export class BusinessDnaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessDnaError";
  }
}
