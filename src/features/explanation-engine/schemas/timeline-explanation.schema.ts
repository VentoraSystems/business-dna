import { z } from "zod";
import {
  TimelineConsiderationCategory,
  type TimelineConsideration,
  type TimelineExplanation,
} from "../dto/timeline-explanation.dto";

export const timelineConsiderationSchema: z.ZodType<TimelineConsideration> = z.object({
  category: z.nativeEnum(TimelineConsiderationCategory),
  translationKey: z.string().min(1),
  months: z.number().min(0).optional(),
});

export const timelineExplanationSchema: z.ZodType<TimelineExplanation> = z.object({
  considerations: z.array(timelineConsiderationSchema),
  fitsStatedTimeline: z.boolean().optional(),
});
