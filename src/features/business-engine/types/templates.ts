import type {
  BusinessBlueprintTemplate,
  BusinessMarketingTemplate,
  BusinessFinancialTemplate,
  BusinessLaunchTemplate,
} from "@prisma/client";

/** Everything the future document generators need for one BusinessType, bundled. */
export interface BusinessTypeTemplateBundle {
  blueprint: BusinessBlueprintTemplate | null;
  marketing: BusinessMarketingTemplate | null;
  financial: BusinessFinancialTemplate | null;
  launch: BusinessLaunchTemplate | null;
}
