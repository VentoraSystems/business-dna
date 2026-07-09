import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  businessDnaProfileSchema,
  BUSINESS_DNA_PROFILE_SCHEMA_VERSION,
} from "../src/features/business-dna/schemas/business-dna-profile.schema";

/**
 * Validates every package under ./technology against the NEW Business
 * Library format — features/business-dna's BusinessDnaProfile contract,
 * NOT business-library/schema.ts's legacy Business Genome schema (that
 * one is still checked by ./validate.ts, unchanged). Run with:
 *
 *   npm run validate:business-library-packages
 *
 * Checks, per package:
 *   1. Required files are present.
 *   2. metadata.json parses and has every required field.
 *   3. business-dna.json validates against BusinessDnaProfile.
 *   4. metadata.json's schemaVersion matches manifest.json's schemaVersion
 *      (and both match features/business-dna's own
 *      BUSINESS_DNA_PROFILE_SCHEMA_VERSION).
 *   5. The package's slug is registered in manifest.json's `packages` list.
 *
 * Exits non-zero if any package fails, so this can also run as a CI
 * check before a package is merged.
 */

const REQUIRED_FILES = [
  "README.md",
  "metadata.json",
  "business-dna.json",
  "blueprint.md",
  "financial.json",
  "marketing.json",
  "roadmap.json",
  "resources.json",
  "ai-notes.md",
] as const;

const REQUIRED_METADATA_FIELDS = [
  "id",
  "slug",
  "version",
  "schemaVersion",
  "createdAt",
  "updatedAt",
  "status",
  "difficulty",
  "industry",
  "category",
  "businessModel",
  "canonical",
  "language",
  "author",
  "reviewStatus",
] as const;

interface ManifestPackageEntry {
  slug: string;
  path: string;
  status: string;
  canonical: boolean;
}

interface Manifest {
  schemaVersion: string;
  packages: ManifestPackageEntry[];
}

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function validatePackage(packageDir: string, manifest: Manifest): string[] {
  const errors: string[] = [];
  const slug = path.basename(packageDir);

  // 1. Required files present.
  for (const file of REQUIRED_FILES) {
    if (!existsSync(path.join(packageDir, file))) {
      errors.push(`missing required file "${file}"`);
    }
  }
  if (!existsSync(path.join(packageDir, "assets")) || !statSync(path.join(packageDir, "assets")).isDirectory()) {
    errors.push(`missing required "assets/" directory`);
  }

  // 2. metadata.json parses with required fields.
  const metadataPath = path.join(packageDir, "metadata.json");
  let metadata: Record<string, unknown> | undefined;
  if (existsSync(metadataPath)) {
    try {
      metadata = readJson(metadataPath) as Record<string, unknown>;
      for (const field of REQUIRED_METADATA_FIELDS) {
        if (!(field in metadata)) {
          errors.push(`metadata.json is missing required field "${field}"`);
        }
      }
    } catch (error) {
      errors.push(`metadata.json is invalid JSON: ${(error as Error).message}`);
    }
  }

  // 3. business-dna.json validates against BusinessDnaProfile.
  const businessDnaPath = path.join(packageDir, "business-dna.json");
  if (existsSync(businessDnaPath)) {
    try {
      const businessDna = readJson(businessDnaPath);
      const result = businessDnaProfileSchema.safeParse(businessDna);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push(`business-dna.json: ${issue.path.join(".")}: ${issue.message}`);
        }
      }
    } catch (error) {
      errors.push(`business-dna.json is invalid JSON: ${(error as Error).message}`);
    }
  }

  // 4. schemaVersion consistency between metadata.json and manifest.json.
  if (metadata) {
    if (metadata.schemaVersion !== manifest.schemaVersion) {
      errors.push(
        `metadata.json's schemaVersion ("${metadata.schemaVersion}") does not match manifest.json's schemaVersion ("${manifest.schemaVersion}")`
      );
    }
    if (manifest.schemaVersion !== BUSINESS_DNA_PROFILE_SCHEMA_VERSION) {
      errors.push(
        `manifest.json's schemaVersion ("${manifest.schemaVersion}") does not match features/business-dna's BUSINESS_DNA_PROFILE_SCHEMA_VERSION ("${BUSINESS_DNA_PROFILE_SCHEMA_VERSION}")`
      );
    }
  }

  // 5. Slug registered in manifest.json.
  const isRegistered = manifest.packages.some((entry) => entry.slug === slug);
  if (!isRegistered) {
    errors.push(`slug "${slug}" is not registered in manifest.json's "packages" list`);
  }

  return errors;
}

function main() {
  const technologyDir = path.join(__dirname, "technology");
  const manifestPath = path.join(__dirname, "manifest.json");

  if (!existsSync(manifestPath)) {
    console.error("✗ business-library/manifest.json is missing.");
    process.exitCode = 1;
    return;
  }
  const manifest = readJson(manifestPath) as Manifest;

  if (!existsSync(technologyDir)) {
    console.log("No packages found in ./technology.");
    return;
  }

  const packageDirs = readdirSync(technologyDir).filter((entry) =>
    statSync(path.join(technologyDir, entry)).isDirectory()
  );

  if (packageDirs.length === 0) {
    console.log("No packages found in ./technology.");
    return;
  }

  let hasFailure = false;

  for (const dir of packageDirs) {
    const packageDir = path.join(technologyDir, dir);
    const errors = validatePackage(packageDir, manifest);

    if (errors.length === 0) {
      console.log(`✓ ${dir}`);
    } else {
      hasFailure = true;
      console.error(`✗ ${dir}`);
      for (const error of errors) {
        console.error(`    ${error}`);
      }
    }
  }

  if (hasFailure) {
    console.error("\nOne or more Business Library packages failed validation.");
    process.exitCode = 1;
  } else {
    console.log(`\nAll ${packageDirs.length} Business Library package(s) are valid.`);
  }
}

main();
