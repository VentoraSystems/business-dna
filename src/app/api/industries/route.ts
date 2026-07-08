import { NextResponse } from "next/server";
import { businessRepository } from "@/features/business-engine/repositories";

export async function GET() {
  const industries = await businessRepository.listIndustries();
  return NextResponse.json({ items: industries });
}
