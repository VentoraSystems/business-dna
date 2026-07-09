import { describe, it, expect } from "vitest";
import { marketingSchema, marketingCreateSchema, marketingUpdateSchema } from "../schemas/marketing.schema";
import emptyTemplate from "../templates/empty-marketing.json";

describe("marketingSchema", () => {
  it("accepts the empty template JSON as-is", () => {
    expect(marketingSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("rejects a Marketing missing a required top-level section", () => {
    const { positioning: _positioning, ...withoutPositioning } = emptyTemplate;
    expect(marketingSchema.safeParse(withoutPositioning).success).toBe(false);
  });

  it("rejects a channelStrategy with an invalid channel key", () => {
    const invalid = {
      ...emptyTemplate,
      channelStrategy: { channels: ["not-a-real-channel"] },
    };
    expect(marketingSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts a valid channelStrategy entry (reused from knowledge-engine's MarketingChannelKey)", () => {
    const valid = {
      ...emptyTemplate,
      channelStrategy: { channels: ["seo", "emailMarketing"] },
    };
    expect(marketingSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an icp with an invalid customerType", () => {
    const invalid = {
      ...emptyTemplate,
      icp: { customerType: "not-a-real-type" },
    };
    expect(marketingSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("marketingCreateSchema / marketingUpdateSchema", () => {
  it("create accepts the empty template", () => {
    expect(marketingCreateSchema.safeParse(emptyTemplate).success).toBe(true);
  });

  it("update accepts an empty object", () => {
    expect(marketingUpdateSchema.safeParse({}).success).toBe(true);
  });
});
