import { NextResponse } from "next/server";
import { businessRepository } from "@/features/business-engine/repositories";

/**
 * Fetches a single catalog BusinessType by id, fully populated (lifestyle,
 * risk, budget, revenue, timeline, skills, tags, tools, resources,
 * requirements/advantages/disadvantages). This is a catalog read, not the
 * user's own saved `Business` — that stays under the existing
 * `/(dashboard)/businesses/[businessId]` page. No matching or
 * personalization happens here.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const businessType = await businessRepository.findFullById(id);

  if (!businessType) {
    return NextResponse.json({ error: "Business type not found." }, { status: 404 });
  }

  return NextResponse.json(businessType);
}
