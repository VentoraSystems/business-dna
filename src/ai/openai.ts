import "server-only";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("[openai] OPENAI_API_KEY is not set — AI routes will fail at runtime.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "not-set",
});
