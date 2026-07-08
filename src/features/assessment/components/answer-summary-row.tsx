"use client";

import { useTranslations } from "next-intl";
import type { QuestionConfig, AnswerValue } from "../types";

interface AnswerSummaryRowProps {
  sectionKey: string;
  question: QuestionConfig;
  value: AnswerValue;
}

export function AnswerSummaryRow({ sectionKey, question, value }: AnswerSummaryRowProps) {
  const t = useTranslations(`assessment.questions.${sectionKey}.${question.key}`);
  const tUnits = useTranslations("assessment.units");
  const tReview = useTranslations("assessment.review");

  function formatValue(): string {
    if (value === null || value === undefined || value === "") {
      return tReview("unanswered");
    }

    switch (question.type) {
      case "single_choice":
        return t(`options.${value as string}` as "options.a");
      case "multiple_choice":
      case "cards": {
        const values = Array.isArray(value) ? value : [];
        if (values.length === 0) return tReview("unanswered");
        return values.map((v) => t(`options.${v}` as "options.a")).join(", ");
      }
      case "slider":
        return question.unit && question.unit !== "none"
          ? tUnits(question.unit, { value: value as number })
          : String(value);
      case "rating":
        return `${value} / ${question.max ?? 5}`;
      default:
        return String(value);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{t("label")}</span>
      <span className="max-w-[60%] text-right font-medium">{formatValue()}</span>
    </div>
  );
}
