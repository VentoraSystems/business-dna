import { NotImplementedError } from "../utils/errors";

/**
 * A named, typed prompt template. `build()` is what will eventually
 * assemble the actual prompt string — every template here throws until
 * its content is authored. Keeping `requiredVariables` as real, typed data
 * (rather than leaving it for later too) means calling code can already
 * validate it has what a prompt will need, before that prompt has any
 * content to fill in.
 *
 * Once implemented, `build()` should route its output through
 * `withLocaleInstruction()` (src/ai/prompts/business-match.ts) so every
 * matching-engine prompt stays consistent with how the rest of the app
 * pins AI output to the user's locale.
 */
export interface PromptTemplate<TVariables extends Record<string, unknown>> {
  id: string;
  description: string;
  requiredVariables: (keyof TVariables)[];
  build: (variables: TVariables) => string;
}

export function definePlaceholderPrompt<TVariables extends Record<string, unknown>>(config: {
  id: string;
  description: string;
  requiredVariables: (keyof TVariables)[];
}): PromptTemplate<TVariables> {
  return {
    ...config,
    build: () => {
      throw new NotImplementedError(
        "AIExplanation",
        `Prompt template "${config.id}" has no content yet.`
      );
    },
  };
}
