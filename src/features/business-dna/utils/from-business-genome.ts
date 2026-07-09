import { NotImplementedError } from "./errors";
import type { BusinessGenome } from "../types/reused-from-business-library";
import type { BusinessDnaProfile } from "../types/business-dna-profile";

/**
 * The future adapter from business-library's content shape to this
 * feature's canonical runtime shape — NOT implemented this sprint. This
 * sprint defines the target shape (`BusinessDnaProfile`) only; mapping a
 * real, validated `BusinessGenome` onto it (deciding, for instance, how
 * `identity`/`founderFit`/etc. pass through unchanged vs. how the
 * genuinely new sections — Skill DNA, Entrepreneur DNA Match, Business
 * Characteristics, KPIs, Business Lifecycle — get populated from a
 * document that has no equivalent fields) is real logic, deliberately
 * left for a future sprint.
 *
 * Placed in `utils/` rather than a `services/` folder: this sprint's
 * spec doesn't list a `services/` folder (unlike matching-engine/
 * explanation-engine), and `utils/` is explicitly scoped to "local
 * NotImplementedError + any generic helpers" — a single throwing
 * function stub fits that description better than introducing a folder
 * the spec didn't ask for.
 */
export function fromBusinessGenome(_genome: BusinessGenome): BusinessDnaProfile {
  throw new NotImplementedError(
    "fromBusinessGenome",
    "No BusinessGenome → BusinessDnaProfile mapping logic exists yet — this sprint defines the target shape only."
  );
}
