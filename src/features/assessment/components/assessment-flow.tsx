"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnswersState } from "../types";
import { useAssessmentFlow } from "../hooks/use-assessment-flow";
import { IntroScreen } from "./intro-screen";
import { QuestionShell } from "./question-shell";
import { QuestionRenderer } from "./question-renderer";
import { ProgressBar } from "./progress-bar";
import { ReviewScreen } from "./review-screen";
import { ThinkingScreen } from "./thinking-screen";
import { ResultsPlaceholder } from "./results-placeholder";
import { totalQuestionCount } from "../config/sections";

interface AssessmentFlowProps {
  sessionId: string;
  initialStep: number;
  initialAnswers: AnswersState;
}

function isAnswered(question: { isRequired?: boolean }, value: unknown): boolean {
  if (question.isRequired === false) return true;
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function AssessmentFlow({ sessionId, initialStep, initialAnswers }: AssessmentFlowProps) {
  const t = useTranslations("assessment");
  const tNav = useTranslations("assessment.nav");
  const tSections = useTranslations("assessment.sections");
  const tAutosave = useTranslations("assessment.autosave");
  const tValidation = useTranslations("assessment.validation");

  const flow = useAssessmentFlow({ sessionId, initialStep, initialAnswers });
  const [showValidationError, setShowValidationError] = React.useState(false);

  const currentValue = flow.currentQuestion ? flow.answers[flow.currentQuestion.key] ?? null : null;
  const currentAnswered = flow.currentQuestion ? isAnswered(flow.currentQuestion, currentValue) : true;

  function handleNext() {
    if (!currentAnswered) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    flow.goNext();
  }

  // Keyboard navigation: Enter advances (except inside a multi-line
  // textarea, where Enter should just insert a newline).
  React.useEffect(() => {
    if (flow.phase !== "section") return;

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTextarea = target.tagName === "TEXTAREA";

      if (e.key === "Enter" && !isTextarea) {
        e.preventDefault();
        handleNext();
      }
      if (e.key === "ArrowLeft" && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        flow.goBack();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.phase, flow.stepIndex, currentAnswered, flow.answers]);

  if (flow.phase === "intro") {
    return <IntroScreen hasProgress={flow.hasAnyProgress} onStart={flow.startFlow} />;
  }

  if (flow.phase === "review") {
    return (
      <ReviewScreen
        answers={flow.answers}
        onEditSection={flow.goToSection}
        onSubmit={flow.submitReview}
        isSubmitting={flow.isSubmitting}
      />
    );
  }

  if (flow.phase === "thinking") {
    return <ThinkingScreen onComplete={flow.handleThinkingComplete} />;
  }

  if (flow.phase === "results") {
    // completeAssessmentSession() failed before this phase was reached (rare — the hook still
    // transitions to "results" so the user isn't stuck on the thinking screen forever) —
    // there's no assessmentId to fetch results for, so surface that plainly instead of
    // rendering a results page with nothing behind it.
    if (!flow.assessmentId) {
      return (
        <div className="mx-auto max-w-lg py-16 text-center">
          <p className="text-muted-foreground">{tValidation("resultsUnavailable")}</p>
        </div>
      );
    }
    return <ResultsPlaceholder assessmentId={flow.assessmentId} />;
  }

  // phase === "section"
  const question = flow.currentQuestion;
  if (!question) return null;

  const sectionTitle = tSections(`${question.sectionKey}.title` as "aboutYou.title");
  const questionLabel = t(`questions.${question.sectionKey}.${question.key}.label` as "intro.title");
  const questionDescriptionKey = `questions.${question.sectionKey}.${question.key}.description`;
  const questionDescription = t.has(questionDescriptionKey as "intro.title")
    ? t(questionDescriptionKey as "intro.title")
    : undefined;

  return (
    <div>
      <div className="mx-auto mb-8 max-w-xl">
        <ProgressBar percent={flow.progressPercent} />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {t("stepLabel", {
              current: flow.stepIndex + 1,
              total: totalQuestionCount,
              section: sectionTitle,
            })}
          </span>
          {flow.saveStatus !== "idle" && (
            <span className="flex items-center gap-1">
              {flow.saveStatus === "saved" && <Check className="h-3 w-3 text-success" />}
              {flow.saveStatus === "saving" ? tAutosave("saving") : tAutosave("saved")}
            </span>
          )}
        </div>
      </div>

      <QuestionShell
        motionKey={question.key}
        eyebrow={sectionTitle}
        title={questionLabel}
        description={questionDescription}
        footer={
          <div>
            {showValidationError && !currentAnswered && (
              <p className="mb-3 text-center text-sm text-error">{tValidation("required")}</p>
            )}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={flow.goBack}
                disabled={flow.stepIndex === 0}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                {tNav("back")}
              </Button>
              <Button onClick={handleNext} className="gap-1.5">
                {flow.stepIndex === totalQuestionCount - 1 ? tNav("finish") : tNav("next")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      >
        <QuestionRenderer
          sectionKey={question.sectionKey}
          question={question}
          value={currentValue}
          onChange={(value) => {
            setShowValidationError(false);
            flow.setAnswer(question.key, value);
          }}
        />
      </QuestionShell>
    </div>
  );
}
