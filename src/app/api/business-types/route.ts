import { NextResponse } from "next/server";
import { businessRepository } from "@/features/business-engine/repositories";
import {
  businessModelTypeSchema,
  businessDifficultySchema,
  industryTypeSchema,
} from "@/features/business-engine/schemas";

/**
 * Placeholder catalog-browsing endpoint. Returns published BusinessTypes
 * with optional filters — no compatibility scoring, no personalization.
 * The future matching endpoint (not implemented here) is what will take a
 * user's Assessment into account; this one just lists the catalog.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const categoryId = searchParams.get("categoryId") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const take = searchParams.get("take") ? Number(searchParams.get("take")) : undefined;
  const skip = searchParams.get("skip") ? Number(searchParams.get("skip")) : undefined;

  const businessModelResult = businessModelTypeSchema.safeParse(searchParams.get("businessModel"));
  const difficultyResult = businessDifficultySchema.safeParse(searchParams.get("difficulty"));
  const industryResult = industryTypeSchema.safeParse(searchParams.get("industry"));

  const filters = {
    categoryId,
    search,
    take,
    skip,
    isPublished: true,
    ...(businessModelResult.success ? { businessModel: businessModelResult.data } : {}),
    ...(difficultyResult.success ? { difficulty: difficultyResult.data } : {}),
    ...(industryResult.success ? { industryCode: industryResult.data } : {}),
  };

  const [items, total] = await Promise.all([
    businessRepository.list(filters),
    businessRepository.count(filters),
  ]);

  return NextResponse.json({ items, total });
}
