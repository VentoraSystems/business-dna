/**
 * Thrown by every placeholder implementation in this feature. Mirrors
 * `features/matching-engine/utils/errors.ts` in shape and intent, but is
 * kept as its own class (not imported across features) so this feature
 * never takes on a dependency direction toward matching-engine just for
 * error handling.
 */
export class NotImplementedError extends Error {
  readonly stage: string;

  constructor(stage: string, detail?: string) {
    super(
      `[explanation-engine] "${stage}" has no implementation yet — this is architecture only.` +
        (detail ? ` ${detail}` : "")
    );
    this.name = "NotImplementedError";
    this.stage = stage;
  }
}

/** Base class for errors that *do* represent a real (future) failure mode. */
export class ExplanationEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExplanationEngineError";
  }
}
