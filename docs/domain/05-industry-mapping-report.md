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

## 5. Deep-Dive: Temporary Mappings Reassessed

Before recommending a schema migration, this section checks how
`IndustryType` is **actually consumed** by downstream code today — not
how the architecture is eventually intended to use it — for the two
Section 2 categories. The finding that shapes both verdicts below:
across the whole repo, `IndustryType` is **actively read and branched
on in exactly one place** — the Business Engine catalog's `list()`
query filter (`src/features/business-engine/repositories/business-repository.ts`,
`buildWhere()`: `...(filters.industryCode ? { category: { industry: { code: filters.industryCode } } } : {})`,
exercised end-to-end via `GET /api/business-types?industry=` in
`src/app/api/business-types/route.ts`). Everywhere else it's a
**declared field with no consuming logic yet**:

| Consumer | Status | Detail |
|---|---|---|
| Matching Engine | Declared, not consumed | `scoring/dimensions.ts` declares `MatchingDimension.IndustryPreference` as an enum member; no scorer, weight config, or rule file in `matching-engine/**` ever reads it. |
| Blueprint | Declared, not consumed | `industry?: IndustryType` exists on `BusinessOverview` (`types/sections.ts`); `features/blueprint` is CRUD/schema/DTO only — there is no generation logic anywhere in the repo that reads this field to vary output. |
| Marketing | Not even declared | `features/marketing` has no `industry` field on any of its own types and no code referencing `IndustryType` at all. |
| KPI sets | Declared elsewhere, not consumed for selection | `BusinessDnaKpiKey` (`business-dna/types/sections/kpis.ts`) is one fixed, universal 10-metric list applied to every profile regardless of industry; `IndustryType` appears elsewhere only as a tag value in vocabulary unions (e.g. Knowledge Engine cross-references), never as a KPI-selection input. |
| Financial | Not even declared | `features/financial` has no `industry` field anywhere in its types, schemas, or templates. |
| Business Engine catalog | **Actively consumed** | Real Prisma `where` filter on `BusinessType.category.industry.code`, used by the catalog browse/list endpoint. The route's own comment notes this is "no compatibility scoring, no personalization" — pure catalog filtering. |

This means the honest "what breaks today" story for both categories is
narrower than the original report implied: nothing in Matching Engine,
Blueprint, Marketing, or KPI selection can be "misled" by a bad
industry tag today, because none of them read the field yet. The one
concrete, currently-real harm is **catalog filtering** — a business
mistagged to the wrong `IndustryType` becomes invisible to anyone
browsing/filtering the catalog by the industry it actually belongs to.
The architectural risk for the other four consumers is real but
prospective: the fields exist because industry-conditional Matching
Engine/Blueprint/Marketing/KPI logic is clearly the intended future
architecture, and a mistagged category would silently feed wrong
assumptions into that logic once it's built — but that has not happened
yet, and this report does not claim otherwise.

### 5.1 `subscription-boxes`

- **Current `IndustryType`:** `food`. **Business-model attribute being
  conflated:** "subscription" — already a first-class value in
  `businessModelTypeSchema` (`ecommerce`/`saas`/`service`/`marketplace`/
  `content`/`physicalProduct`/`subscription`/`agency`, defined in
  `business-engine/schemas/enums.ts` and mirrored in
  `business-library/schema.ts`). The category name describes *how*
  the product reaches the customer (a recurring, curated shipment),
  not *what* is being sold — food is just the one example the
  placeholder scaffold picked.
- **Downstream consumption, concretely:**
  - *Business Engine catalog filter (actively consumed):* if a real
    beauty-subscription-box business were authored and tagged
    `industry: "food"` (inheriting the category's current tag), a user
    filtering `GET /api/business-types?industry=fashion` (the closest
    real vertical for a beauty product) would never see it — it would
    only surface under a `food` filter, where it doesn't belong. This
    is a real, demonstrable bug in the one place `IndustryType`
    currently does something.
  - *Matching Engine / Blueprint / Marketing / KPIs:* no current
    breakage, per the table above — none of these read `industry` yet.
    Prospectively, once Blueprint generation exists, an
    `industry: "food"`-tagged beauty-box Blueprint would risk pulling
    food-market framing (grocery/CPG competitive landscape) into a
    business that actually competes in beauty/personal care — but this
    is a future risk to flag, not a present one.
  - *Financial:* no industry-conditional cost-category logic exists at
    all (financial templates are industry-agnostic), so mistagging
    causes no financial-module distortion today or foreseeably under
    the current architecture.
- **Industry problem or business-model problem?** **Business model.**
  The dimension actually being described — "recurring curated
  shipment" — is exactly what `businessModelTypeSchema`'s `subscription`
  value already exists to capture. Adding a new `IndustryType` would
  not fix the real issue (which vertical does this box serve?); it
  would just create another mis-scoped bucket.
- **Verdict: Needs different architectural fix (not IndustryType).**
  The correct fix is authoring discipline at the point a real business
  is authored: set `industry` to whatever vertical the box's contents
  actually belong to (`food`, `fashion`, `health`, etc.) **and**
  `businessModel: "subscription"` in that business's `metadata.json` —
  a field that already exists and is already populated correctly for
  every currently-authored business (e.g. `accounting-firm`'s
  `"businessModel": "service"`). The one real gap: `categories.json`'s
  placeholder-category entries have no `businessModel` field at all
  (only `key`/`label`/`industry`) — that's a documentation/scaffold
  gap in how placeholder categories are recorded, not a schema
  blocker, since real authored businesses already have the field
  available via `metadata.json`. Out of scope for an `IndustryType`
  schema migration.

### 5.2 `local-service-marketplaces`

- **Current `IndustryType`:** `homeServices`. **Business-model
  attribute being conflated:** "marketplace" — also already a
  first-class `businessModelTypeSchema` value. "Local service
  marketplace" describes a matching/aggregation business model (many
  independent providers, one platform), not a single industry — the
  category could just as easily match customers with tutors (education),
  personal trainers (health), or freelance professional-services
  providers (professionalServices) as with home-repair providers.
- **Downstream consumption, concretely:**
  - *Business Engine catalog filter (actively consumed):* a real
    tutoring-marketplace business tagged `industry: "homeServices"`
    (inherited from this category) would be invisible to a user
    filtering `?industry=education`, and would incorrectly surface
    under a `homeServices` filter alongside actual home-repair
    businesses — the same concrete bug pattern as 5.1.
  - *Matching Engine / Blueprint / Marketing / KPIs:* no current
    breakage — none of these consume `industry` yet, per the table
    above. Prospectively, a Blueprint for a tutoring marketplace tagged
    `homeServices` would risk inheriting home-repair-style market
    framing (contractor licensing, on-site service logistics) instead
    of education-marketplace framing (tutor vetting, session
    scheduling, learning outcomes) — again, a future risk, not a
    present one.
  - *Financial:* no industry-conditional logic exists, so no present
    or foreseeable distortion under the current architecture.
- **Industry problem or business-model problem?** **Business model.**
  Same reasoning as 5.1 — "marketplace" is the actual concept being
  described, and it's already a dedicated `businessModelTypeSchema`
  value distinct from industry.
- **Verdict: Needs different architectural fix (not IndustryType).**
  Same fix as 5.1: tag the real vertical on `industry` and
  `businessModel: "marketplace"` on `metadata.json` when a real
  business is authored under this category (or split the placeholder
  into vertical-specific categories, e.g.
  `home-repair-service-marketplaces` vs. `tutoring-marketplaces`, each
  correctly industry-tagged). No new `IndustryType` value is warranted.
  Out of scope for an `IndustryType` schema migration.

---

## 6. Final Schema Migration Scope (Recommendation)

Consolidating Section 3's original finding with this deep-dive:

| Proposed `IndustryType` enum value | Source | Included in next migration? |
|---|---|---|
| `mediaProduction` | `niche-content-studios` (Section 3) | **Yes** — the only category in the entire 16-entry taxonomy with no adequate existing `IndustryType`, even as a lossy fit. Still Low priority (unauthored placeholder, nothing currently blocked) but the correct fix genuinely is a new enum value. |
| _(none)_ — `subscription-boxes` | Reassessed in 5.1 | **No** — business-model problem, not an industry problem. Fix: tag the real vertical + `businessModel: "subscription"` at authoring time. |
| _(none)_ — `local-service-marketplaces` | Reassessed in 5.2 | **No** — business-model problem, not an industry problem. Fix: tag the real vertical + `businessModel: "marketplace"` at authoring time. |

**Recommended next schema migration adds exactly one `IndustryType`
value: `mediaProduction`.** Neither Section 2 category should be
promoted to a dedicated `IndustryType` — both are cases where the
Business Library's authoring process needs to use the `businessModel`
field it already has, not a new industry bucket. This keeps the
`IndustryType` enum scoped to what it's actually for (industry
vertical) and avoids growing it with values that really belong on a
different, already-existing dimension.

---

## Summary

- **Section 1 (Direct Mappings):** 13 of 16 categories.
- **Section 2 (Temporary Acceptable Mappings):** 2 of 16 categories — both reassessed in Section 5; **neither promoted** to a dedicated `IndustryType` (business-model problems, not industry problems).
- **Section 3 (Categories Requiring Taxonomy Expansion):** 1 of 16 categories (`niche-content-studios` → `mediaProduction`, confirmed for the next migration in Section 6).
