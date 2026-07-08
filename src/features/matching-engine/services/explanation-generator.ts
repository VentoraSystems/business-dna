import { NotImplementedError } from "../utils/errors";
import { MatchingPipelineStage } from "../types/pipeline";
import type { Locale } from "@/i18n/config";
import type { RankedCandidate } from "./ranking-engine";

export interface ExplanationContext {
  candidate: RankedCandidate;
  locale: Locale;
}

/**
 * Turns a ranked, scored candidate into human-readable explanations. Each
 * method corresponds to one prompt template in ../prompts — see that
 * folder for the (also unimplemented) prompt structures this service will
 * eventually call through `@/ai/openai`. No method here calls the OpenAI
 * client yet; that's deliberate, since none of the prompts have real
 * content to send.
 */
export interface ExplanationGenerator {
  explainMatch(context: ExplanationContext): Promise<string>;
  explainStrengths(context: ExplanationContext): Promise<string>;
  explainWeaknesses(context: ExplanationContext): Promise<string>;
  suggestImprovements(context: ExplanationContext): Promise<string>;
  summarizeBusiness(context: ExplanationContext): Promise<string>;
}

export class PlaceholderExplanationGenerator implements ExplanationGenerator {
  async explainMatch(_context: ExplanationContext): Promise<string> {
    throw new NotImplementedError(MatchingPipelineStage.AIExplanation, "ExplanationGenerator.explainMatch");
  }

  async explainStrengths(_context: ExplanationContext): Promise<string> {
    throw new NotImplementedError(
      MatchingPipelineStage.AIExplanation,
      "ExplanationGenerator.explainStrengths"
    );
  }

  async explainWeaknesses(_context: ExplanationContext): Promise<string> {
    throw new NotImplementedError(
      MatchingPipelineStage.AIExplanation,
      "ExplanationGenerator.explainWeaknesses"
    );
  }

  async suggestImprovements(_context: ExplanationContext): Promise<string> {
    throw new NotImplementedError(
      MatchingPipelineStage.AIExplanation,
      "ExplanationGenerator.suggestImprovements"
    );
  }

  async summarizeBusiness(_context: ExplanationContext): Promise<string> {
    throw new NotImplementedError(
      MatchingPipelineStage.AIExplanation,
      "ExplanationGenerator.summarizeBusiness"
    );
  }
}
