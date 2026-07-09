import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { validateBusinessGenome } from "./schema";

/**
 * @deprecated — Validates the legacy Business Genome format only (see
 * ./schema.ts). Do NOT use this for new content — new businesses go
 * through business-library/technology/ and are validated by
 * business-library/validate-packages.ts against features/business-dna's
 * schema instead. This file's behavior is unchanged; kept only for the
 * one legacy document still in ./json. Will be removed in a future
 * migration sprint.
 */

/**
 * Validates every *.json file in ./json against the Business Genome
 * standard defined in ./schema.ts. Run with:
 *
 *   npm run validate:business-library
 *
 * Exits non-zero if any document fails validation, so this can also run
 * as a CI check before a genome is merged.
 */
function main() {
  const jsonDir = path.join(__dirname, "json");
  const files = readdirSync(jsonDir).filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.log("No Business Genome documents found in ./json.");
    return;
  }

  let hasFailure = false;

  for (const file of files) {
    const filePath = path.join(jsonDir, file);
    const raw = readFileSync(filePath, "utf-8");

    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      hasFailure = true;
      console.error(`✗ ${file} — invalid JSON: ${(error as Error).message}`);
      continue;
    }

    const result = validateBusinessGenome(data);
    if (result.success) {
      console.log(`✓ ${file}`);
    } else {
      hasFailure = true;
      console.error(`✗ ${file}`);
      for (const issue of result.errors ?? []) {
        console.error(`    ${issue}`);
      }
    }
  }

  if (hasFailure) {
    console.error("\nOne or more Business Genome documents failed validation.");
    process.exitCode = 1;
  } else {
    console.log(`\nAll ${files.length} Business Genome document(s) are valid.`);
  }
}

main();
