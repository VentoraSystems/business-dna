import { describe, it, expect } from "vitest";
import { createMatchingEngine } from "../services/matching-engine";
import { NotImplementedError } from "../utils/errors";

describe("createMatchingEngine", () => {
  it("throws NotImplementedError at the Assessment Answers stage when no fetchRawAnswers is supplied", async () => {
    const engine = createMatchingEngine();
    await expect(
      engine.run({ assessmentId: "a1", userId: "u1", locale: "en" })
    ).rejects.toBeInstanceOf(NotImplementedError);
  });

  it("proceeds to the Normalization stage (and throws there) once fetchRawAnswers is supplied", async () => {
    const engine = createMatchingEngine({
      fetchRawAnswers: async () => ({ assessmentId: "a1", userId: "u1", locale: "en", answers: {} }),
    });

    await expect(
      engine.run({ assessmentId: "a1", userId: "u1", locale: "en" })
    ).rejects.toMatchObject({ stage: "normalization" });
  });
});
