import { describe, it, expect } from "vitest";
import { PlaceholderActionPlanner } from "../services/action-planner";
import { NotImplementedError } from "../utils/errors";
import { fakeExplanationEngineInput } from "./fixtures";

describe("PlaceholderActionPlanner", () => {
  it("plan() throws NotImplementedError", async () => {
    const planner = new PlaceholderActionPlanner();
    await expect(planner.plan([], [], fakeExplanationEngineInput)).rejects.toBeInstanceOf(
      NotImplementedError
    );
  });
});
