import type { SectionConfig } from "../types";

/**
 * Section and question order here drives: the step indicator, the seed
 * script that populates `AssessmentQuestion`, and the Zod schema builder in
 * `./schema.ts`. Changing an order or adding a question only requires a
 * matching entry in messages/en.json and messages/ro.json under
 * `assessment.questions.<sectionKey>.<questionKey>`.
 */
export const assessmentSections: readonly SectionConfig[] = [
  {
    key: "aboutYou",
    questions: [
      { key: "age", type: "short_text", maxLength: 3, isRequired: true },
      { key: "country", type: "short_text", maxLength: 60, isRequired: true },
      {
        key: "employment",
        type: "single_choice",
        options: ["employed", "selfEmployed", "student", "unemployed"],
        isRequired: true,
      },
      {
        key: "weeklyAvailability",
        type: "slider",
        min: 1,
        max: 60,
        step: 1,
        unit: "hours",
        isRequired: true,
      },
      {
        key: "incomeUrgency",
        type: "single_choice",
        options: ["low", "moderate", "high", "critical"],
        isRequired: true,
      },
    ],
  },
  {
    key: "financialSituation",
    questions: [
      { key: "budget", type: "slider", min: 0, max: 50000, step: 500, unit: "currency", isRequired: true },
      {
        key: "targetMonthlyIncome",
        type: "slider",
        min: 0,
        max: 20000,
        step: 250,
        unit: "currency",
        isRequired: true,
      },
      {
        key: "desiredTimeline",
        type: "single_choice",
        options: ["threeMonths", "sixMonths", "oneYear", "twoYearsPlus"],
        isRequired: true,
      },
    ],
  },
  {
    key: "personality",
    questions: [
      {
        key: "decisionMaking",
        type: "single_choice",
        options: ["intuitive", "analytical", "collaborative", "decisive"],
        isRequired: true,
      },
      {
        key: "motivation",
        type: "single_choice",
        options: ["money", "freedom", "impact", "recognition"],
        isRequired: true,
      },
      { key: "sellingPreference", type: "rating", isRequired: true },
      { key: "leadership", type: "rating", isRequired: true },
      { key: "problemSolving", type: "rating", isRequired: true },
      { key: "creativity", type: "rating", isRequired: true },
      {
        key: "structureVsFlexibility",
        type: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "percent",
        isRequired: true,
      },
    ],
  },
  {
    key: "skills",
    questions: [
      { key: "marketing", type: "rating", isRequired: true },
      { key: "sales", type: "rating", isRequired: true },
      { key: "programming", type: "rating", isRequired: true },
      { key: "ai", type: "rating", isRequired: true },
      { key: "finance", type: "rating", isRequired: true },
      { key: "management", type: "rating", isRequired: true },
      { key: "design", type: "rating", isRequired: true },
      { key: "content", type: "rating", isRequired: true },
      { key: "negotiation", type: "rating", isRequired: true },
      { key: "communication", type: "rating", isRequired: true },
    ],
  },
  {
    key: "lifestyle",
    questions: [
      {
        key: "remote",
        type: "single_choice",
        options: ["remote", "hybrid", "inPerson", "noPreference"],
        isRequired: true,
      },
      {
        key: "travel",
        type: "single_choice",
        options: ["none", "occasional", "frequent"],
        isRequired: true,
      },
      {
        key: "employees",
        type: "single_choice",
        options: ["soloOnly", "smallTeam", "largeTeam", "noPreference"],
        isRequired: true,
      },
      { key: "freedom", type: "rating", isRequired: true },
      { key: "workingHours", type: "slider", min: 10, max: 80, step: 5, unit: "hours", isRequired: true },
      {
        key: "b2bVsB2c",
        type: "single_choice",
        options: ["b2b", "b2c", "both", "noPreference"],
        isRequired: true,
      },
      {
        key: "onlineVsOffline",
        type: "single_choice",
        options: ["online", "offline", "hybrid", "noPreference"],
        isRequired: true,
      },
    ],
  },
  {
    key: "risk",
    questions: [
      { key: "riskTolerance", type: "slider", min: 0, max: 100, step: 1, unit: "percent", isRequired: true },
      { key: "failureTolerance", type: "rating", isRequired: true },
      { key: "investmentConfidence", type: "rating", isRequired: true },
    ],
  },
  {
    key: "interests",
    questions: [
      {
        key: "industries",
        type: "multiple_choice",
        options: [
          "health",
          "tech",
          "food",
          "education",
          "fashion",
          "finance",
          "travel",
          "sustainability",
          "entertainment",
          "homeServices",
          "professionalServices",
        ],
        isRequired: true,
      },
      {
        key: "businessModels",
        type: "cards",
        options: [
          "ecommerce",
          "saas",
          "service",
          "marketplace",
          "content",
          "physicalProduct",
          "subscription",
          "agency",
        ],
        isRequired: true,
      },
      { key: "topics", type: "long_text", maxLength: 600, isRequired: false },
      { key: "neverDo", type: "long_text", maxLength: 600, isRequired: false },
    ],
  },
  {
    key: "vision",
    questions: [
      { key: "fiveYearVision", type: "long_text", maxLength: 800, isRequired: true },
      { key: "definitionOfSuccess", type: "long_text", maxLength: 800, isRequired: true },
    ],
  },
] as const;

export const flattenedQuestions = assessmentSections.flatMap((section, sectionIndex) =>
  section.questions.map((question, questionIndex) => ({
    ...question,
    sectionKey: section.key,
    sectionIndex,
    questionIndex,
    order: sectionIndex * 100 + questionIndex,
  }))
);

export const totalQuestionCount = flattenedQuestions.length;

export function getSectionByKey(sectionKey: string) {
  return assessmentSections.find((section) => section.key === sectionKey);
}
