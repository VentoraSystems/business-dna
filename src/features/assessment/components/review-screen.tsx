"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assessmentSections } from "../config/sections";
import type { AnswersState } from "../types";
import { AnswerSummaryRow } from "./answer-summary-row";

interface ReviewScreenProps {
  answers: AnswersState;
  onEditSection: (sectionKey: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewScreen({ answers, onEditSection, onSubmit, isSubmitting }: ReviewScreenProps) {
  const t = useTranslations("assessment.review");
  const tSections = useTranslations("assessment.sections");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-4">
        {assessmentSections.map((section) => (
          <Card key={section.key}>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-base font-semibold">
                  {tSections(`${section.key}.title` as "aboutYou.title")}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => onEditSection(section.key)}>
                  {t("editLabel")}
                </Button>
              </div>
              <div className="divide-y divide-border">
                {section.questions.map((question) => (
                  <AnswerSummaryRow
                    key={question.key}
                    sectionKey={section.key}
                    question={question}
                    value={answers[question.key] ?? null}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={onSubmit} disabled={isSubmitting}>
          {t("submitCta")}
        </Button>
      </div>
    </div>
  );
}
