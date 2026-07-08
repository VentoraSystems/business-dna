import { z } from "zod";
import type { QuestionConfig } from "../types";
import { flattenedQuestions } from "./sections";

/**
 * Build the Zod schema for a single question from its config. Centralized
 * here so every input component and the review/submit step validate the
 * exact same rules.
 */
export function buildQuestionSchema(question: QuestionConfig) {
  const required = question.isRequired ?? true;

  switch (question.type) {
    case "short_text": {
      const base = z.string().trim().max(question.maxLength);
      return required ? base.min(1) : base.optional().or(z.literal(""));
    }
    case "long_text": {
      const base = z.string().trim().max(question.maxLength);
      return required ? base.min(1) : base.optional().or(z.literal(""));
    }
    case "single_choice": {
      const base = z.enum(question.options as [string, ...string[]]);
      return required ? base : base.optional();
    }
    case "multiple_choice":
    case "cards": {
      const base = z.array(z.enum(question.options as [string, ...string[]]));
      return required ? base.min(1) : base;
    }
    case "slider": {
      return z.number().min(question.min).max(question.max);
    }
    case "rating": {
      const min = question.min ?? 1;
      const max = question.max ?? 5;
      return z.number().min(min).max(max);
    }
    default: {
      const exhaustiveCheck: never = question;
      throw new Error(`Unhandled question type: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

/** Full-flow schema, keyed by question key, for the review/submit step. */
export function buildAssessmentSchema() {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const question of flattenedQuestions) {
    shape[question.key] = buildQuestionSchema(question);
  }
  return z.object(shape);
}

export type AssessmentFormValues = z.infer<ReturnType<typeof buildAssessmentSchema>>;
