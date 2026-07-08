/**
 * Thrown by every placeholder implementation in this feature. Its purpose
 * is to make "this stage has no real logic yet" an explicit, typed,
 * catchable signal — not a generic crash — so calling code (and tests) can
 * assert on it directly instead of guessing whether a failure means "not
 * implemented" or "actually broken".
 */
export class NotImplementedError extends Error {
  readonly stage: string;

  constructor(stage: string, detail?: string) {
    super(
      `[matching-engine] "${stage}" has no implementation yet — this is architecture only.` +
        (detail ? ` ${detail}` : "")
    );
    this.name = "NotImplementedError";
    this.stage = stage;
  }
}

/** Base class for errors that *do* represent a real (future) failure mode. */
export class MatchingEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MatchingEngineError";
  }
}
