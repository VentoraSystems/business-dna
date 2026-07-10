# Industry Mapping Report

_Documentation only — no code, schema, or Business Library content was
changed to produce this report._

## Sources read to produce this report

- **`IndustryType` enum** — `prisma/schema.prisma` (and its two
  conventionally-synced copies, `src/features/business-engine/schemas/enums.ts`
  and `business-library/schema.ts`). All three currently agree on the
  same **11 values**: `health`, `tech`, `food`, `education`, `fashion`,
  `finance`, `travel`, `sustainability`, `entertainment`, `homeServices`,
  `professionalServices`. `professionalServices` was added in a prior
  Taxonomy Expansion sprint; the other 10 are original.
- **Business Library taxonomy** — `business-library/taxonomy/categories.json`.
  This is the only closed, enumerable list of Business Library
  "categories" that actually exists in the repo today. It currently
  contains **16 entries**, each already assigned to one of the 11
  `IndustryType` values above. (Note: this task's brief described a
  "22-category list" — that count does not match what's in the repo.
  `business-engine`'s `BusinessCategory` schema, the only other
  "category" concept in the codebase, is an open, freeform
  slug/translationKey pair with no fixed list at all — see
  `src/features/business-engine/schemas/taxonomy.ts`. This report is
  based on the real 16-entry list in `categories.json`, per the
  instruction to verify against what actually exists rather than invent
  categories to hit an expected count.)
- **Folder-per-business authoring structure** — `business-library/technology/*/metadata.json`
  for all 9 packages (`ai-automation-agency` plus the 8 published
  businesses: `accounting-firm`, `financial-consultancy`,
  `insurance-brokerage`, `tax-consultancy`, `law-firm`,
  `hr-consultancy`, `recruitment-agency`, `business-consultancy`). Of
  the 16 categories in `categories.json`, only these 9 currently back a
  real (or template) authored business; the other 7 — `subscription-boxes`,
  `boutique-fitness-studios`, `online-course-platforms`,
  `sustainable-fashion-brands`, `local-service-marketplaces`,
  `boutique-travel-agencies`, `niche-content-studios` — are, per
  `categories.json`'s own `description` field, "illustrative placeholder
  categories only... a starting scaffold... not a finalized taxonomy,"
  with no authored business behind them yet.

---

## 1. Direct Mappings

Categories that map onto an existing `IndustryType` with no meaningful
semantic loss.

| Category | IndustryType | Notes |
|---|---|---|
| `ai-automation-agencies` | `tech` | AI/automation service agencies are squarely a technology vertical; this is the one `categories.json` entry with a real (template) authored business, `ai-automation-agency`. |
| `boutique-fitness-studios` | `health` | Fitness/wellness studios are a standard subset of the health industry. |
| `online-course-platforms` | `education` | Direct fit — the category's entire premise is education delivery. |
| `sustainable-fashion-brands` | `fashion` | Direct fit on the product category (apparel); the "sustainable" qualifier is a positioning attribute, not a separate industry, and `sustainability` also exists as its own `IndustryType` if a future business is sustainability-practice-focused rather than fashion-product-focused. |
| `boutique-travel-agencies` | `travel` | Direct fit — travel agencies are the canonical example of the travel industry. |
| `accounting-firms` | `finance` | Bookkeeping/tax/financial-statement work is a core financial-services function. Confirmed as a natural fit (not a stretch) in the prior Professional Services fit analysis. |
| `financial-consultancies` | `finance` | Financial planning/advisory is definitionally a financial-services function. |
| `insurance-brokerages` | `finance` | Insurance brokerage sits squarely in financial services alongside accounting and financial planning. |
| `tax-consultancies` | `finance` | Tax preparation/planning is a financial-compliance function, the same category as accounting. |
| `law-firms` | `professionalServices` | Legal practice is a textbook professional-services vertical — a genuine fit once this `IndustryType` value existed (it had no natural fit under the original 10-value enum). |
| `hr-consultancies` | `professionalServices` | HR advisory is a classic professional/B2B advisory service. |
| `recruitment-agencies` | `professionalServices` | Staffing/recruitment is commonly categorized under professional services. |
| `business-consultancies` | `professionalServices` | Management/strategy consulting is the textbook definition of "professional services." |

**13 of 16 categories** map directly.

---

## 2. Temporary Acceptable Mappings

Categories forced into an existing `IndustryType` for now, with some
semantic loss — usable today, but the mapping conflates two different
concepts (an **industry vertical** vs. a **business model/distribution
mechanism**, which `businessModelTypeSchema` already models separately
via values like `subscription` and `marketplace`).

| Category | Current IndustryType used | What is lost / distorted by this mapping |
|---|---|---|
| `subscription-boxes` | `food` | "Subscription box" describes a **business model** (recurring, curated physical-product delivery — already a distinct `businessModelTypeSchema` value, `subscription`), not an industry. Real subscription-box businesses span beauty, books, pet products, hobby/craft kits, wellness, and more, not just food. Tagging the category to `food` specifically is an artifact of which one example the placeholder scaffold happened to pick, not a genuine industry classification. Nothing currently *breaks* because no business is authored under this category yet, but authoring a non-food subscription-box business under this same category key would misclassify its industry outright. |
| `local-service-marketplaces` | `homeServices` | Same pattern: "marketplace" is a business model (`businessModelTypeSchema`'s `marketplace` value), not an industry. A "local service marketplace" could match customers with home-repair providers, tutors, personal trainers, or professional-services freelancers — `homeServices` only covers one slice of that. As with `subscription-boxes`, no business is authored under this category yet, so the loss is latent, not active. |

**2 of 16 categories** fall here. In both cases the fix is authoring
discipline (assign the category to whichever real product/service
industry the specific business actually sells into, or split the
placeholder into vertical-specific categories) rather than a new
`IndustryType` value — `IndustryType` is meant to describe *what* a
business is about, and business model is already a separate,
purpose-built vocabulary. Recorded here rather than in Section 3.

---

## 3. Categories Requiring Taxonomy Expansion

Categories with no existing `IndustryType` that is adequate even as a
temporary/lossy fit.

### Niche Content Studios

- **Category name:** `niche-content-studios`
- **Closest existing IndustryType:** `entertainment`
- **Why that mapping is insufficient:** `entertainment` (as used
  elsewhere in this taxonomy — films, games, streaming, live events)
  carries a strong **consumer-product** connotation: revenue from
  audiences, distribution platforms, and attention/engagement metrics.
  A "content studio" that operates as a **B2B service** — producing
  video, podcasts, or written content *for other businesses' brands*
  (the same kind of agency relationship `ai-automation-agency` and the
  8 published Professional Services businesses model) is a
  fundamentally different business, and forcing it under
  `entertainment` breaks several downstream assumptions this codebase
  already treats as industry-dependent:
  - **Matching Engine assumptions:** a person who marks `entertainment`
    as an interest (via Assessment's `interests.industries` question)
    is signaling interest in *making or distributing entertainment
    products for audiences* — not in running a client-services agency.
    Routing a content-production-as-a-service business through the same
    industry tag would match the wrong founder-fit profile (audience/
    creative-builder vs. client-services operator).
  - **Blueprint content (Market Intelligence section):** an
    `entertainment`-tagged Blueprint would default to entertainment-
    market framing (streaming competition, box-office/attention
    economics) — irrelevant to a content-production agency, whose real
    market is other businesses' marketing budgets and competing
    agencies, the same market framing the already-authored Professional
    Services businesses use.
  - **Marketing Engine assumptions:** consumer entertainment marketing
    leans on audience-acquisition channels (virality, influencer,
    platform distribution); a B2B content-production agency's real
    channels are referral networks, portfolio/case-study selling, and
    direct outreach — the same channel mix already documented for the
    8 published Professional Services businesses, not for entertainment
    products.
  - **KPI sets:** entertainment-style KPIs (audience size, engagement,
    streams/downloads) don't apply; the relevant KPIs are the
    agency-style ones already used across the published businesses
    (MRR/ARR, client retention, close rate).
- **Recommended future IndustryType:** `mediaProduction` (alternative
  candidate name: `contentServices`) — scoped specifically to
  businesses that produce media/content *as a service for other
  businesses or brands*, distinct from `entertainment`'s
  consumer-product connotation.

**1 of 16 categories** requires genuine taxonomy expansion. No business
is currently authored under this category (it remains an unauthored
placeholder scaffold), so nothing is actively broken today — this is a
latent gap, not a blocked authoring effort.

---

## 4. Proposed Industry Taxonomy Expansion Backlog

| Proposed enum value | Business Library categories it would unblock | Priority | Dependency / sequencing note |
|---|---|---|---|
| `mediaProduction` | `niche-content-studios` (and any future B2B content/media-production business authored under a similar category) | **Low** | Not blocking anything today — `niche-content-studios` is an unauthored placeholder scaffold, not a ready-to-author business the way Law Firm/HR Consultancy/Recruitment Agency/Business Consultancy were before `professionalServices` existed. No dependency; add whenever a real content-production-as-a-service business is queued for authoring. |

Only one candidate qualifies for this backlog under the current repo
state. For contrast, the precedent this report follows is
`professionalServices` itself: that value was added specifically
because it **blocked 4 fully-designed, ready-to-author businesses**
(documented in
`business-library/technology/PROFESSIONAL-SERVICES-INDUSTRY-REPORT.md`)
— a "High" priority case, since real authoring work was stalled on it.
`mediaProduction`'s situation is different in kind: it resolves a
conceptual gap in an unauthored scaffold category, not an active
authoring blocker, which is why it's recorded as Low priority rather
than escalated.

The two Section 2 categories (`subscription-boxes`,
`local-service-marketplaces`) are **not** included in this backlog —
per Section 2's reasoning, their issue is a business-model/industry
conflation best resolved by authoring discipline (tag the eventual real
business to whatever industry it actually sells into) rather than by
adding a new `IndustryType` value.

---

## Summary

- **Section 1 (Direct Mappings):** 13 of 16 categories.
- **Section 2 (Temporary Acceptable Mappings):** 2 of 16 categories.
- **Section 3 (Categories Requiring Taxonomy Expansion):** 1 of 16 categories.
