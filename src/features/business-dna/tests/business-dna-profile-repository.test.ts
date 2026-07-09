import { describe, it, expect } from "vitest";
import { InMemoryBusinessDnaProfileRepository } from "../repositories/business-dna-profile-repository";
import emptyTemplate from "../templates/empty-business-dna-profile.json";
import type { BusinessDnaProfileCreateDto } from "../dto/business-dna-profile-create.dto";
import { BusinessDnaSkillKey } from "../types/sections/lifestyle-and-skill";

const template = emptyTemplate as unknown as BusinessDnaProfileCreateDto;

describe("InMemoryBusinessDnaProfileRepository", () => {
  it("starts empty — list() returns [] with nothing created", async () => {
    const repo = new InMemoryBusinessDnaProfileRepository();
    expect(await repo.list()).toEqual([]);
  });

  it("findById()/findBySlug() return null for a non-existent profile, not a throw", async () => {
    const repo = new InMemoryBusinessDnaProfileRepository();
    expect(await repo.findById("does-not-exist")).toBeNull();
    expect(await repo.findBySlug("does-not-exist")).toBeNull();
  });

  it("create() then findById()/findBySlug() round-trip", async () => {
    const repo = new InMemoryBusinessDnaProfileRepository();
    const created = await repo.create(template);
    expect(await repo.findById(created.identity.id)).toEqual(created);
    expect(await repo.findBySlug(created.identity.slug)).toEqual(created);
  });

  it("update() merges at the section level and returns null for an unknown id", async () => {
    const repo = new InMemoryBusinessDnaProfileRepository();
    const created = await repo.create(template);

    const updated = await repo.update(created.identity.id, {
      skillDna: { ratings: [{ key: BusinessDnaSkillKey.Sales, rating: 9 }] },
    });
    expect(updated?.skillDna.ratings).toEqual([{ key: "sales", rating: 9 }]);
    expect(updated?.identity).toEqual(created.identity);

    expect(await repo.update("does-not-exist", {})).toBeNull();
  });

  it("delete() removes a profile and reports whether one was actually removed", async () => {
    const repo = new InMemoryBusinessDnaProfileRepository();
    const created = await repo.create(template);
    expect(await repo.delete(created.identity.id)).toBe(true);
    expect(await repo.findById(created.identity.id)).toBeNull();
    expect(await repo.delete(created.identity.id)).toBe(false);
  });
});
