# Resources — architecture

`features/resources` is the authoring framework for the **Resources**
document — a 16-category curated-resource list, schemas/templates/
validation only. No real content, no invented resource entries.

## Purpose

A Resources document is the curated list of books/courses/communities/
etc. behind one BusinessType's plan — the sixth generator in the
pipeline below. `templates/empty-resources.json` is the "fill in the
blanks" starting point: an empty resource list.

## Pipeline

```
Business Library → Business DNA Profile → Matching Engine → Blueprint → Marketing → Financial → Roadmap → Resources → AI Co-Founder
                                                                                                    ↑ this feature
```

## New canonical superset

Per this epic's explicit instruction, `ResourceCategoryKey` (16
categories: Books, Courses, Communities, Podcasts, YouTube, Newsletters,
Blogs, Templates, Checklists, Software, AI Tools, Prompt Libraries,
Documents, Certifications, Events, Experts) is the **new canonical,
broader superset** for the "resources" domain going forward. Two
existing, narrower resource types are referenced here in prose only —
**neither is modified or imported by this feature**:

| This feature's `ResourceCategoryKey` (16, new canonical) | business-dna's `BusinessDnaResourceCategory` (7, existing) | business-engine's `ResourceType` (5, existing) |
|---|---|---|
| Books | books | — |
| Courses | courses | — |
| Communities | communities | — |
| Podcasts | *(no equivalent — new)* | — |
| YouTube | youtube | video |
| Newsletters | *(no equivalent — new)* | — |
| Blogs | *(no equivalent — new)* | article (closest conceptual match, not identical) |
| Templates | templates | — |
| Checklists | checklists | checklist |
| Software | *(no equivalent — new)* | — |
| AI Tools | *(no equivalent — new)* | — |
| Prompt Libraries | *(no equivalent — new)* | — |
| Documents | documents | — |
| Certifications | *(no equivalent — new)* | — |
| Events | *(no equivalent — new)* | — |
| Experts | *(no equivalent — new)* | — |
| — | — | guide (no equivalent here — folded conceptually into Courses/Documents, not mapped 1:1) |
| — | — | playbook (no equivalent here — folded conceptually into Templates/Documents, not mapped 1:1) |

`business-dna/types/sections/resources.ts` (`ResourcesSection`,
consumed as-is by `features/blueprint`'s "Resources" section — see that
feature's README) and `business-engine/schemas/enums.ts`'s
`resourceTypeSchema` remain untouched. Reconciling all three into one
shared vocabulary is a documented future option, not done here.

## Reuse table

| Section | Reuses from | Genuinely new | Conflict to flag |
|---|---|---|---|
| Category vocabulary (`ResourceCategoryKey`, 16 categories) | — (deliberately not business-dna's 7 or business-engine's 5 — see "New canonical superset" above) | The whole enum | Three now-parallel resource vocabularies exist (this feature's 16, business-dna's 7, business-engine's 5); not reconciled this sprint |
| Resource item shape | — | The whole shape (`category`, `titleTranslationKey`, `descriptionTranslationKey?`, `url?`) | — |
| AI Metadata | Same *pattern* as the other Business Assets' AI Metadata | The field set itself | Independently defined, same reasoning as `features/blueprint`'s `BlueprintAiMetadata` |

## Architecture notes

- **No `services/` folder** — same reasoning as the other Business
  Assets features.
- **`InMemoryResourcesRepository` is an empty in-memory stub**, not a
  throwing placeholder — matches features/business-dna's precedent.
- **Keyed by `businessTypeId`**, same relationship the other Business
  Assets have to their BusinessType.
- **`types/reused.ts` is intentionally empty** (`export {}`) — this is
  the one feature in this sprint that reuses nothing at the type level
  from elsewhere; everything it cross-references (business-dna's
  `ResourcesSection`, business-engine's `ResourceType`) is referenced in
  this README's prose only, per the epic's explicit instruction not to
  modify or alias either existing file.

## Tests

`tests/` asserts `templates/empty-resources.json` validates against
`resourcesSchema`, plus accept/reject cases for malformed DTOs.
