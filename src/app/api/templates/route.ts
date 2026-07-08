import { NextResponse } from "next/server";
import { z } from "zod";
import { templateRepository } from "@/features/business-engine/repositories";

const querySchema = z.object({ businessTypeId: z.string().cuid() });

/**
 * Returns the blueprint/marketing/financial/launch template skeletons for
 * one BusinessType — the shape the future document generators will fill
 * in, not generated content itself.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ businessTypeId: searchParams.get("businessTypeId") });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "A valid \"businessTypeId\" query parameter is required." },
      { status: 400 }
    );
  }

  const bundle = await templateRepository.getBundle(parsed.data.businessTypeId);
  return NextResponse.json(bundle);
}
