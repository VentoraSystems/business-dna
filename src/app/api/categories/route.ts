import { NextResponse } from "next/server";
import { businessRepository } from "@/features/business-engine/repositories";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const industryId = searchParams.get("industryId") ?? undefined;

  const categories = await businessRepository.listCategories(industryId);
  return NextResponse.json({ items: categories });
}
