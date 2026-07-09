import type { BusinessInsights } from "../types/business-insights";

/** Input to update an existing Business Insights document — partial at the section level, same granularity as the other Business Assets UpdateDtos. */
export type BusinessInsightsUpdateDto = Partial<BusinessInsights>;
