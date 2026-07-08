import { describe, it, expect } from "vitest";
import { RepositoryBusinessCandidateProvider } from "../services/business-candidate-provider";
import { NotImplementedError } from "../utils/errors";
import type { BusinessRepository } from "@/features/business-engine/repositories/business-repository";

/** A minimal fake so this test never touches a real database. */
function createFakeRepository(rows: { id: string; slug: string; translationKey: string }[]): BusinessRepository {
  return {
    findFullById: async () => null,
    findFullBySlug: async () => null,
    list: async () => rows as never,
    count: async () => rows.length,
    listCategories: async () => [],
    listIndustries: async () => [],
  };
}

describe("RepositoryBusinessCandidateProvider", () => {
  it("returns an empty array when the catalog has no published BusinessTypes", async () => {
    const provider = new RepositoryBusinessCandidateProvider(createFakeRepository([]));
    const candidates = await provider.getCandidates();
    expect(candidates).toEqual([]);
  });

  it("throws NotImplementedError once a BusinessType exists and needs mapping to a BusinessCandidate", async () => {
    const provider = new RepositoryBusinessCandidateProvider(
      createFakeRepository([{ id: "bt_1", slug: "example", translationKey: "businessTypes.example.name" }])
    );
    await expect(provider.getCandidates()).rejects.toBeInstanceOf(NotImplementedError);
  });
});
