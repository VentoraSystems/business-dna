"use client";

import * as React from "react";
import { flattenedQuestions, totalQuestionCount } from "../config/sections";
import type { AnswerValue, AnswersState, AssessmentPhase } from "../types";
import { saveAnswer, updateSessionStep, completeAssessmentSession } from "../actions/assessment-actions";

const AUTOSAVE_DEBOUNCE_MS = 600;

interface UseAssessmentFlowArgs {
  sessionId: string;
  initialStep: number;
  initialAnswers: AnswersState;
}

export function useAssessmentFlow({ sessionId, initialStep, initialAnswers }: UseAssessmentFlowArgs) {
  const hasAnyProgress = Object.keys(initialAnswers).length > 0 || initialStep > 0;

  const [phase, setPhase] = React.useState<AssessmentPhase>("intro");
  const [stepIndex, setStepIndex] = React.useState(Math.min(initialStep, totalQuestionCount - 1));
  const [answers, setAnswers] = React.useState<AnswersState>(initialAnswers);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = flattenedQuestions[stepIndex];

  const persist = React.useCallback(
    (questionKey: string, value: AnswerValue, step: number) => {
      setSaveStatus("saving");
      saveAnswer({ sessionId, questionKey, value, currentStep: step })
        .then(() => setSaveStatus("saved"))
        .catch(() => setSaveStatus("idle"));
    },
    [sessionId]
  );

  const setAnswer = React.useCallback(
    (key: string, value: AnswerValue) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => persist(key, value, stepIndex), AUTOSAVE_DEBOUNCE_MS);
    },
    [persist, stepIndex]
  );

  function startFlow() {
    setPhase("section");
  }

  function goNext() {
    if (!currentQuestion) return;

    // Flush any pending debounce immediately so "Next" never races autosave.
    if (debounceRef.current) clearTimeout(debounceRef.current);
    persist(currentQuestion.key, answers[currentQuestion.key] ?? null, stepIndex);

    if (stepIndex >= totalQuestionCount - 1) {
      setPhase("review");
      return;
    }

    const nextStep = stepIndex + 1;
    setStepIndex(nextStep);
    updateSessionStep(sessionId, nextStep).catch(() => undefined);
  }

  function goBack() {
    if (phase === "review") {
      setPhase("section");
      return;
    }
    if (stepIndex === 0) return;
    const prevStep = stepIndex - 1;
    setStepIndex(prevStep);
    updateSessionStep(sessionId, prevStep).catch(() => undefined);
  }

  function goToSection(sectionKey: string) {
    const targetIndex = flattenedQuestions.findIndex((q) => q.sectionKey === sectionKey);
    if (targetIndex === -1) return;
    setStepIndex(targetIndex);
    setPhase("section");
    updateSessionStep(sessionId, targetIndex).catch(() => undefined);
  }

  async function submitReview() {
    setIsSubmitting(true);
    setPhase("thinking");
  }

  async function handleThinkingComplete() {
    try {
      await completeAssessmentSession(sessionId);
    } finally {
      setIsSubmitting(false);
      setPhase("results");
    }
  }

  const currentSectionKey = currentQuestion?.sectionKey;
  const completedSectionKeys = Array.from(
    new Set(
      flattenedQuestions
        .filter((q) => flattenedQuestions.indexOf(q) < stepIndex && q.sectionKey !== currentSectionKey)
        .map((q) => q.sectionKey)
    )
  );

  const progressPercent =
    phase === "section" ? Math.round(((stepIndex + 1) / totalQuestionCount) * 100) : 100;

  return {
    phase,
    hasAnyProgress,
    stepIndex,
    currentQuestion,
    currentSectionKey,
    completedSectionKeys,
    answers,
    setAnswer,
    saveStatus,
    isSubmitting,
    progressPercent,
    startFlow,
    goNext,
    goBack,
    goToSection,
    submitReview,
    handleThinkingComplete,
  };
}
