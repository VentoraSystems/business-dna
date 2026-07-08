import { NextResponse } from "next/server";
import { openai } from "@/ai/openai";
import { buildCoFounderSystemPrompt } from "@/ai/prompts/business-match";
import { isValidLocale, defaultLocale } from "@/i18n/config";
import { requireCurrentUser } from "@/lib/auth";

interface ChatRequestBody {
  businessName: string;
  locale: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request) {
  await requireCurrentUser();

  const { businessName, locale, messages }: ChatRequestBody = await req.json();
  const activeLocale = isValidLocale(locale) ? locale : defaultLocale;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildCoFounderSystemPrompt(activeLocale, businessName) },
      ...messages,
    ],
  });

  return NextResponse.json({
    message: completion.choices[0]?.message?.content ?? "",
  });
}
