export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "slider"
  | "rating"
  | "cards"
  | "long_text"
  | "short_text";

export interface BaseQuestionConfig {
  key: string;
  type: QuestionType;
  isRequired?: boolean;
}

export interface ChoiceQuestionConfig extends BaseQuestionConfig {
  type: "single_choice" | "multiple_choice" | "cards";
  options: readonly string[];
}

export interface SliderQuestionConfig extends BaseQuestionConfig {
  type: "slider";
  min: number;
  max: number;
  step: number;
  unit?: "currency" | "hours" | "percent" | "none";
}

export interface RatingQuestionConfig extends BaseQuestionConfig {
  type: "rating";
  min?: number;
  max?: number;
}

export interface TextQuestionConfig extends BaseQuestionConfig {
  type: "long_text" | "short_text";
  maxLength: number;
}

export type QuestionConfig =
  | ChoiceQuestionConfig
  | SliderQuestionConfig
  | RatingQuestionConfig
  | TextQuestionConfig;

export interface SectionConfig {
  key: string;
  questions: readonly QuestionConfig[];
}

/** The value shape stored for a single answer, before it's JSON-serialized. */
export type AnswerValue = string | string[] | number | null;

export type AnswersState = Record<string, AnswerValue>;

export type AssessmentPhase = "intro" | "section" | "review" | "thinking" | "results";
