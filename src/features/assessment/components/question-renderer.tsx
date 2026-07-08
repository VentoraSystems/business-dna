"use client";

import { useTranslations } from "next-intl";
import type { QuestionConfig, AnswerValue } from "../types";
import { SingleChoiceInput } from "./inputs/single-choice-input";
import { MultipleChoiceInput } from "./inputs/multiple-choice-input";
import { CardsInput } from "./inputs/cards-input";
import { SliderInput } from "./inputs/slider-input";
import { RatingInput } from "./inputs/rating-input";
import { ShortTextInput } from "./inputs/short-text-input";
import { LongTextInput } from "./inputs/long-text-input";

interface QuestionRendererProps {
  sectionKey: string;
  question: QuestionConfig;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export function QuestionRenderer({ sectionKey, question, value, onChange }: QuestionRendererProps) {
  const t = useTranslations(`assessment.questions.${sectionKey}.${question.key}`);
  const tUnits = useTranslations("assessment.units");
  const tRating = useTranslations("assessment.rating");

  switch (question.type) {
    case "single_choice":
      return (
        <SingleChoiceInput
          name={question.key}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
          options={question.options}
          getOptionLabel={(option) => t(`options.${option}` as "options.a")}
        />
      );
    case "multiple_choice":
      return (
        <MultipleChoiceInput
          name={question.key}
          value={Array.isArray(value) ? value : []}
          onChange={(v) => onChange(v)}
          options={question.options}
          getOptionLabel={(option) => t(`options.${option}` as "options.a")}
        />
      );
    case "cards":
      return (
        <CardsInput
          name={question.key}
          value={Array.isArray(value) ? value : []}
          onChange={(v) => onChange(v)}
          options={question.options}
          getOptionLabel={(option) => t(`options.${option}` as "options.a")}
        />
      );
    case "slider":
      return (
        <SliderInput
          value={typeof value === "number" ? value : undefined}
          onChange={(v) => onChange(v)}
          min={question.min}
          max={question.max}
          step={question.step}
          formatValue={(v) =>
            question.unit && question.unit !== "none"
              ? tUnits(question.unit, { value: v })
              : String(v)
          }
        />
      );
    case "rating":
      return (
        <RatingInput
          name={question.key}
          value={typeof value === "number" ? value : undefined}
          onChange={(v) => onChange(v)}
          min={question.min ?? 1}
          max={question.max ?? 5}
          lowLabel={tRating("low")}
          highLabel={tRating("high")}
        />
      );
    case "short_text":
      return (
        <ShortTextInput
          name={question.key}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
          maxLength={question.maxLength}
        />
      );
    case "long_text":
      return (
        <LongTextInput
          name={question.key}
          value={typeof value === "string" ? value : undefined}
          onChange={(v) => onChange(v)}
          maxLength={question.maxLength}
        />
      );
    default: {
      const exhaustiveCheck: never = question;
      throw new Error(`Unhandled question type: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}
