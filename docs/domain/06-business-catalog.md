# Business Catalog

## Purpose and scope

This is the **master registry/index** of business models BusinessDNA
intends to eventually support — a planning artifact, not authored
content. It exists so the Business Library content team, the Matching
Engine roadmap, and future Blueprint/Marketing/KPI work all draw from
one shared list instead of ad-hoc proposals.

**This is explicitly not business authoring.** No Business Library
folder, `metadata.json`, Business Genome document, Blueprint, or
Marketing content is created by this file. Every row is a *candidate*
business model — some already have full authored packages (see the
"Already Authored" column below), most do not yet.

## Format choice

Plain Markdown, one table per Business Library category. Reasoning:

- **No code consumes this today.** It is a planning/reference
  document, same role as `05-industry-mapping-report.md`, and lives in
  the same `docs/domain/` location for that reason. A structured
  JSON/CSV file would imply a runtime or build-time consumer that
  doesn't exist yet — introducing one would be speculative scope this
  task explicitly rules out ("do not touch any schema," "only create
  the one new catalog file").
- If this catalog is later machine-consumed (e.g. to seed a `?`
  `BusinessCatalogEntry` table or drive an authoring backlog UI), each
  row already carries every column as a discrete, greppable cell —
  trivial to convert to CSV/JSON at that point without re-deriving the
  data. Grouping by category (rather than one 127-row flat table) is
  purely for human readability; the `Category` column is still
  repeated on every row so no information is lost if grouping is
  stripped.
- **Typecheck/build:** not run for this task. This file is pure
  Markdown, imported by no `.ts`/`.tsx`/`.json` module and referenced
  by no build step — there is nothing for `tsc` or `next build` to
  pick up. Stating this explicitly per the task's own instruction
  ("run typecheck/build only if the catalog is implemented as a
  TS/JSON file that's imported anywhere").

## Source vocabularies (verified before populating — 2026-07-10)

**`IndustryType`** — `prisma/schema.prisma` (12 values, confirmed
current after the `mediaProduction` addition):
`health`, `tech`, `food`, `education`, `fashion`, `finance`, `travel`,
`sustainability`, `entertainment`, `homeServices`,
`professionalServices`, `mediaProduction`.

**`BusinessModelType`** — `businessModelTypeSchema`
(`src/features/business-engine/schemas/enums.ts`, mirrored in
`business-library/schema.ts`), 8 values:
`ecommerce`, `saas`, `service`, `marketplace`, `content`,
`physicalProduct`, `subscription`, `agency`.

**`BusinessDifficulty`** — `businessDifficultySchema` /
`prisma/schema.prisma`'s `BusinessDifficulty` enum, 3 values:
`low`, `moderate`, `high`.

**`ScalabilityLevel`** — `scalabilityLevelSchema` /
`prisma/schema.prisma`'s `ScalabilityLevel` enum, 3 values:
`low`, `moderate`, `high`. The "Scalability" column below uses only
these three values.

**Business Library taxonomy categories** — `business-library/taxonomy/
categories.json`, **28 entries** as of the 2026-07-10 Taxonomy
Synchronization (confirmed against the file directly): `technology-services`
(renamed from `ai-automation-agencies` — same 9-business-type scope,
now expanded), `subscription-boxes`, `boutique-fitness-studios`,
`online-course-platforms`, `sustainable-fashion-brands`,
`local-service-marketplaces`, `boutique-travel-agencies`,
`niche-content-studios`, `accounting-firms`, `financial-consultancies`,
`insurance-brokerages`, `tax-consultancies`, `law-firms`,
`hr-consultancies`, `recruitment-agencies`, `business-consultancies`,
`marketing-agencies`, `ecommerce`, `coaching`, `architecture`,
`real-estate`, `cleaning-services`, `beauty-wellness`, `dental-clinics`,
`veterinary-clinics`, `psychology-practices`, `coffee-shops`,
`restaurants`.

*Status as of Knowledge Authoring Batch 5 (2026-07-15): all 12 of the
new categories introduced in the 2026-07-10 Taxonomy Synchronization
(`real-estate` through `restaurants` in the list above) now have their
flagship P1 candidate authored (1/1) — see the "Category breakdown"
table below.*

*Status as of Knowledge Authoring Batch 6 (2026-07-15, first of 14
planned P2 batches): 5 P2 candidates authored — AI Customer Support
Chatbot Studio (`technology-services`), Boutique Pilates Reformer
Studio (`boutique-fitness-studios`), Cloud Bookkeeping Service for
Startups (`accounting-firms`), Adventure Travel Boutique Agency
(`boutique-travel-agencies`), and Tutoring & Homework Help Marketplace
(`local-service-marketplaces`) — bringing the total authored count to
34. See the per-category notes and the "Category breakdown" table
below.*

*Status as of Knowledge Authoring Batch 7 (2026-07-15, second of 14
planned P2 batches): 4 more P2 candidates authored — RPA Workflow
Automation Consultancy (`technology-services`), Specialty Coffee
Subscription Box (`subscription-boxes`, first entry authored under
this category), Boutique IP Law Practice (`law-firms`, regulated
content), and Home Repair & Handyman Marketplace
(`local-service-marketplaces`, the library's second genuine two-sided
marketplace) — bringing the total authored count to 38.*

*Status as of Knowledge Authoring Batch 8 (2026-07-15, third of 14
planned P2 batches): 4 more P2 candidates authored — AI Sales Outreach
Automation Agency (`technology-services`), Upcycled Denim Label
(`sustainable-fashion-brands`, first entry authored under this
category), Fee-Only Financial Planning Practice
(`financial-consultancies`, regulated content, deliberately
differentiated from Financial Consultancy), and Independent Podcast
Production Studio (`niche-content-studios`, first entry authored under
this category) — bringing the total authored count to 41.*

*Status as of Knowledge Authoring Batch 9 (2026-07-15, fourth of 14
planned P2 batches): 4 more P2 candidates authored — AI Document
Processing SaaS (`technology-services`, the library's first genuine
`saas`-business-model package), Indoor Cycling Studio
(`boutique-fitness-studios`, deliberately differentiated from Boutique
Pilates Reformer Studio), Expat Tax Advisory Practice
(`tax-consultancies`, regulated content, deliberately differentiated
from Tax Consultancy), and Personal Trainer Booking Marketplace
(`local-service-marketplaces`, the library's third genuine two-sided
marketplace) — bringing the total authored count to 45.*

*Status as of Knowledge Authoring Batch 10 (2026-07-15, fifth of 14
planned P2 batches): 4 more P2 candidates authored — No-Code AI
Workflow Builder SaaS (`technology-services`, the library's second
`saas`-business-model package, deliberately differentiated from AI
Document Processing SaaS), Cohort-Based Coding Bootcamp
(`online-course-platforms`, first entry authored under this
category), Independent P&C Insurance Brokerage
(`insurance-brokerages`, regulated content, deliberately
differentiated from Insurance Brokerage), and Luxury Honeymoon
Planning Agency (`boutique-travel-agencies`, deliberately
differentiated from Adventure Travel Boutique Agency) — bringing the
total authored count to 49.*

*Status as of Knowledge Authoring Batch 11 (2026-07-16, sixth of 14
planned P2 batches): 4 more P2 candidates authored — Custom LLM
Integration Consultancy (`technology-services`, deliberately
differentiated from every other AI/tech-service package in this
crowded category — bespoke per-client LLM engineering shipped into a
client's own proprietary systems and data, versus AI Consulting's
strategy-only diagnostic and AI Customer Support Chatbot Studio's
narrow platform-dependent managed service), Clean Beauty Subscription
Box (`subscription-boxes`, deliberately differentiated from Specialty
Coffee Subscription Box on retention mechanics — personalization-quiz
skin-fit churn drivers versus discovery/novelty rotation), Tech
Recruitment Agency (`recruitment-agencies`, deliberately differentiated
from Recruitment Agency on technical-screening recruiter competency,
tech-specific sourcing channels, and remote versus hybrid work mode),
and Organic Cotton Basics Brand (`sustainable-fashion-brands`,
deliberately differentiated from Upcycled Denim Label on business
model — scalable repeatable-inventory `ecommerce` versus
capacity-constrained `physicalProduct` scarcity drops) — bringing the
total authored count to 53. See this batch's own report for the full
technology-services saturation assessment (the category now holds 8
AI/tech-service businesses; judged still distinct, but flagged as
approaching its natural ceiling for further AI-genre P2/P3 entries).*

No enum value or category key was invented — every value used in the
tables below is one of the values listed above, or one of the 12
`IndustryType`/8 `BusinessModelType` values confirmed earlier in this
section.

**Note on `IndustryType` vs. Category:** per
`05-industry-mapping-report.md` §5, a category's own `industry` tag in
`categories.json` is a single loose default, not a constraint on every
business filed under it — a real business's `industry` should reflect
its actual vertical, which can vary within a category (the report's own
example: a subscription box for coffee vs. cosmetics). This catalog
follows that logic for `subscription-boxes` and
`local-service-marketplaces`, and — per the mapping report's §6
rationale for adding `mediaProduction` specifically to fix
`niche-content-studios`'s lossy `entertainment` mapping — uses
`mediaProduction` as that category's primary industry.

## Conventions used in this catalog

**Startup Budget Tier** (no existing schema defines this; convention
stated here, not derived from any enum):
| Tier | Approx. all-in startup cost |
|---|---|
| Low | up to ~€10,000 |
| Medium | ~€10,000–€30,000 |
| High | ~€30,000–€75,000 |
| Very High | above ~€75,000 |

For the 8 already-authored Professional Services businesses, tiers are
derived directly from each package's real
`businessDnaProfile.budget.{minInvestment,maxInvestment}` in its
`business-dna.json` (not guessed). For every other row (not yet
authored), the tier is an editorial estimate for planning purposes,
to be replaced with real figures at authoring time.

**Premium Package** is a judgment call, not a mechanical formula — it
weighs difficulty, budget tier, and regulatory/specialized-expertise
complexity together to flag candidates for a deeper content tier
(extended frameworks, templates, expert-reviewed playbooks) versus the
standard package. It is a planning signal for future content
prioritization, not a commitment.

**Launch Priority:**
- **P1** — already has a full authored Business Library package
  (reflects real current state), or is an unusually strong Matching
  Engine archetype fit.
- **P2** — common, well-understood business model; good near-term
  authoring candidate.
- **P3** — plausible but more niche, speculative, or dependent on
  infrastructure (e.g. a real marketplace/platform) that doesn't exist
  yet.

**Already Authored** column: ✅ marks the 54 packages that exist today
under `business-library/technology/` (53 `published` + 1 `template`,
per `business-library/manifest.json`). Their metadata below (Industry,
BusinessModel, Difficulty, Scalability, Solo Friendly, Budget Tier) is
copied from their real `metadata.json` / `business-dna.json`, not
re-estimated.

---

## Category breakdown (summary)

*Updated 2026-07-10 for the Taxonomy Synchronization: `ai-automation-agencies`
renamed to `technology-services` and expanded with 8 new unauthored
entries; 12 new categories added, each with one flagship P1 entry.*

| Category | Entries | Already Authored |
|---|---:|---:|
| `technology-services` | 20 | 15 |
| `subscription-boxes` | 10 | 2 |
| `boutique-fitness-studios` | 9 | 2 |
| `online-course-platforms` | 10 | 1 |
| `sustainable-fashion-brands` | 9 | 2 |
| `local-service-marketplaces` | 9 | 3 |
| `boutique-travel-agencies` | 8 | 2 |
| `niche-content-studios` | 9 | 1 |
| `accounting-firms` | 6 | 2 |
| `financial-consultancies` | 6 | 2 |
| `insurance-brokerages` | 6 | 2 |
| `tax-consultancies` | 6 | 2 |
| `law-firms` | 7 | 2 |
| `hr-consultancies` | 6 | 1 |
| `recruitment-agencies` | 7 | 2 |
| `business-consultancies` | 7 | 1 |
| `marketing-agencies` | 1 | 1 |
| `ecommerce` | 1 | 1 |
| `coaching` | 1 | 1 |
| `architecture` | 1 | 1 |
| `real-estate` | 1 | 1 |
| `cleaning-services` | 1 | 1 |
| `beauty-wellness` | 1 | 1 |
| `dental-clinics` | 1 | 1 |
| `veterinary-clinics` | 1 | 1 |
| `psychology-practices` | 1 | 1 |
| `coffee-shops` | 1 | 1 |
| `restaurants` | 1 | 1 |
| **Total** | **147** | **49** |

---

## `technology-services`

*Renamed from `ai-automation-agencies` on 2026-07-10 (Taxonomy
Synchronization) — same 9-business-type scope the category always
implied (AI/tech service agencies), now with an explicit broader label
and 8 additional unauthored candidates. The already-authored "AI
Automation Agency" row below is the same business as before — only its
category label changed, no duplicate was created.*

*Knowledge Authoring Batch 1 (2026-07-10) authored 3 more of this
category's P1 candidates in full — Software House, Web Development
Agency, and AI Consulting — bringing this category's authored count to
4 of 20. See `business-library/technology/{software-house,
web-development-agency,ai-consulting}/` for the full packages.*

*Knowledge Authoring Batch 2 (2026-07-10, final batch for this category)
authored the remaining 5 P1 candidates — Mobile App Development Agency,
Cybersecurity Consultancy, IT Managed Services, DevOps Consultancy, and
Data Analytics Consultancy — completing all 9 originally planned
`technology-services` businesses (9 of 20 rows now authored; the
remaining 11 are P2/P3 unauthored candidates). See
`business-library/technology/{mobile-app-development-agency,
cybersecurity-consultancy,it-managed-services,devops-consultancy,
data-analytics-consultancy}/` for the full packages.*

*Knowledge Authoring Batch 6 (2026-07-15) authored this category's
first P2 candidate — AI Customer Support Chatbot Studio — bringing the
authored count to 10 of 20. Deliberately marked `isAIResistant: false`
in its `business-dna.json` despite being an AI-native business itself,
an intentional irony reflecting that AI-support tooling is itself
displaceable by further AI advances. See
`business-library/technology/ai-chatbot-support-studio/` for the full
package.*

*Knowledge Authoring Batch 7 (2026-07-15) authored this category's
second P2 candidate — RPA Workflow Automation Consultancy — bringing
the authored count to 11 of 20. Deliberately narrow, rules-based
scope (fixed-fee single-workflow bot builds via UiPath/Power Automate)
distinct from the broader AI-automation and AI-native businesses
elsewhere in this category. See
`business-library/technology/rpa-workflow-consultancy/` for the full
package.*

*Knowledge Authoring Batch 8 (2026-07-15) authored this category's
third P2 candidate — AI Sales Outreach Automation Agency — bringing the
authored count to 12 of 20. Positioned around self-demonstrated
outbound email/LinkedIn campaigns as its own marketing channel (pilot
campaign converting to a monthly retainer plus a per-booked-meeting
performance bonus), distinct from the AI-support and RPA businesses
already in this category. See
`business-library/technology/ai-sales-outreach-agency/` for the full
package.*

*Knowledge Authoring Batch 9 (2026-07-15) authored this category's
fourth P2 candidate — AI Document Processing SaaS — bringing the
authored count to 13 of 20. The library's first genuine `saas`
business model: a self-serve API and dashboard product billed on
usage-based subscription tiers, distinct from every other
`technology-services` package, which are agencies or consultancies
billing for people's time. See
`business-library/technology/ai-document-processing-saas/` for the
full package.*

*Knowledge Authoring Batch 10 (2026-07-15) authored this category's
second genuine `saas` candidate — No-Code AI Workflow Builder SaaS —
bringing the authored count to 14 of 20. A visual, drag-and-drop
builder for non-technical operations and marketing buyers priced on
seat-plus-workflow-run subscription tiers, deliberately differentiated
from AI Document Processing SaaS by target buyer (non-technical vs.
developer), product shape (visual canvas vs. API), and pricing model.
See `business-library/technology/nocode-ai-workflow-saas/` for the
full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| technology-services | AI Automation Agency | ai-automation-agency | tech | agency | P1 | moderate | Low | No | low | No | ✅ |
| technology-services | AI Customer Support Chatbot Studio | ai-chatbot-support-studio | tech | agency | P2 | moderate | Low | Yes | moderate | No | ✅ |
| technology-services | RPA Workflow Automation Consultancy | rpa-workflow-consultancy | tech | service | P2 | moderate | Low | Yes | low | No | ✅ |
| technology-services | AI Sales Outreach Automation Agency | ai-sales-outreach-agency | tech | agency | P2 | moderate | Low | Yes | moderate | No | ✅ |
| technology-services | Vertical AI Agent Studio for Real Estate | ai-agent-studio-real-estate | tech | agency | P3 | moderate | Medium | Yes | moderate | No | |
| technology-services | AI Document Processing SaaS | ai-document-processing-saas | tech | saas | P2 | high | High | No | high | Yes | ✅ |
| technology-services | Voice AI IVR Automation Agency | voice-ai-ivr-agency | tech | agency | P3 | moderate | Medium | Yes | moderate | No | |
| technology-services | AI Data Enrichment Service | ai-data-enrichment-service | tech | service | P3 | moderate | Low | Yes | low | No | |
| technology-services | No-Code AI Workflow Builder SaaS | nocode-ai-workflow-saas | tech | saas | P2 | high | Very High | No | high | Yes | ✅ |
| technology-services | AI Marketing Ops Automation Agency | ai-marketing-ops-agency | tech | agency | P3 | moderate | Low | Yes | moderate | No | |
| technology-services | Custom LLM Integration Consultancy | llm-integration-consultancy | tech | service | P2 | high | High | No | moderate | Yes | ✅ |
| technology-services | AI Recruiting Screening Automation Agency | ai-recruiting-screening-agency | tech | agency | P3 | moderate | Medium | Yes | moderate | No | |
| technology-services | Software House | software-house | tech | service | P1 | high | Medium | No | moderate | Yes | ✅ |
| technology-services | Web Development Agency | web-development-agency | tech | agency | P1 | moderate | Low | Yes | moderate | No | ✅ |
| technology-services | Mobile App Development Agency | mobile-app-development-agency | tech | agency | P1 | high | Medium | No | moderate | Yes | ✅ |
| technology-services | AI Consulting | ai-consulting | tech | service | P1 | high | Medium | Yes | moderate | Yes | ✅ |
| technology-services | Cybersecurity Consultancy | cybersecurity-consultancy | tech | service | P1 | high | High | No | moderate | Yes | ✅ |
| technology-services | IT Managed Services | it-managed-services | tech | service | P1 | moderate | Medium | No | high | No | ✅ |
| technology-services | DevOps Consultancy | devops-consultancy | tech | service | P1 | high | Medium | Yes | moderate | Yes | ✅ |
| technology-services | Data Analytics Consultancy | data-analytics-consultancy | tech | service | P1 | high | Medium | Yes | high | Yes | ✅ |

## `subscription-boxes`

*Industry varies per business (per §5.1 of the mapping report), `businessModel` fixed to `subscription`.*

*Knowledge Authoring Batch 7 (2026-07-15) authored this category's
first P2 candidate — Specialty Coffee Subscription Box — the first
business authored under this category. Deliberately distinct from
`coffee-shops`' physical dine-in venue elsewhere in this catalog — a
D2C recurring shipped product built on rotating roaster-partnership
sourcing and inventory prepay. See
`business-library/technology/specialty-coffee-subscription-box/` for
the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| subscription-boxes | Specialty Coffee Subscription Box | specialty-coffee-subscription-box | food | subscription | P2 | moderate | Medium | Yes | moderate | No | ✅ |
| subscription-boxes | Clean Beauty Subscription Box | clean-beauty-subscription-box | health | subscription | P2 | moderate | Medium | Yes | moderate | No | ✅ |
| subscription-boxes | Kids' STEM Craft Subscription Box | kids-stem-craft-subscription-box | education | subscription | P3 | moderate | Medium | Yes | moderate | No | |
| subscription-boxes | Sustainable Household Goods Subscription Box | sustainable-household-subscription-box | sustainability | subscription | P3 | moderate | Medium | Yes | moderate | No | |
| subscription-boxes | Men's Grooming Subscription Box | mens-grooming-subscription-box | health | subscription | P3 | moderate | Low | Yes | moderate | No | |
| subscription-boxes | Artisan Snack Subscription Box | artisan-snack-subscription-box | food | subscription | P3 | moderate | Low | Yes | moderate | No | |
| subscription-boxes | Pet Wellness Subscription Box | pet-wellness-subscription-box | health | subscription | P3 | moderate | Medium | Yes | moderate | No | |
| subscription-boxes | Book & Reading Companion Subscription Box | book-companion-subscription-box | entertainment | subscription | P3 | low | Low | Yes | moderate | No | |
| subscription-boxes | Wine Discovery Subscription Box | wine-discovery-subscription-box | food | subscription | P2 | moderate | Medium | Yes | moderate | No | |
| subscription-boxes | Fashion Accessories Subscription Box | fashion-accessories-subscription-box | fashion | subscription | P3 | moderate | Medium | Yes | moderate | No | |

## `boutique-fitness-studios`

*Knowledge Authoring Batch 6 (2026-07-15) authored this category's
first P2 candidate — Boutique Pilates Reformer Studio — the first
business authored under this category. Explicitly framed as "not a
licensed clinical practice," matching the `beauty-wellness` precedent.
See `business-library/technology/boutique-pilates-studio/` for the
full package.*

*Knowledge Authoring Batch 9 (2026-07-15) authored this category's
second P2 candidate — Indoor Cycling Studio — bringing the authored
count to 2 of 9. Deliberately differentiated from Boutique Pilates
Reformer Studio: high-intensity, music-driven cardio rather than
low-impact strength and mobility, a younger cardio-focused target
rider rather than an injury-recovery and midlife-fitness niche, and a
competitive leaderboard/milestone-ride retention mechanic rather than
straightforward membership renewal. See
`business-library/technology/indoor-cycling-studio/` for the full
package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| boutique-fitness-studios | Boutique Pilates Reformer Studio | boutique-pilates-studio | health | service | P2 | moderate | Medium | No | low | No | ✅ |
| boutique-fitness-studios | Indoor Cycling Studio | indoor-cycling-studio | health | subscription | P2 | moderate | Medium | No | low | No | ✅ |
| boutique-fitness-studios | Women's Strength Training Studio | womens-strength-training-studio | health | subscription | P2 | moderate | Medium | No | low | No | |
| boutique-fitness-studios | Boutique Yoga Studio | boutique-yoga-studio | health | service | P2 | moderate | Low | Yes | low | No | |
| boutique-fitness-studios | Recovery & Cryotherapy Studio | recovery-cryotherapy-studio | health | service | P3 | moderate | High | No | low | Yes | |
| boutique-fitness-studios | Group HIIT Bootcamp Studio | group-hiit-bootcamp-studio | health | subscription | P3 | moderate | Medium | Yes | low | No | |
| boutique-fitness-studios | Barre Studio | barre-studio | health | subscription | P3 | moderate | Medium | No | low | No | |
| boutique-fitness-studios | Aerial & Circus Fitness Studio | aerial-circus-fitness-studio | health | service | P3 | high | High | No | low | Yes | |
| boutique-fitness-studios | Senior Mobility & Balance Studio | senior-mobility-balance-studio | health | service | P3 | moderate | Low | Yes | low | No | |

## `online-course-platforms`

*Knowledge Authoring Batch 10 (2026-07-15) authored this category's
first candidate — Cohort-Based Coding Bootcamp — bringing the
authored count to 1 of 10. A live, instructor-led, cohort-based
service business, genuinely distinct in kind from the self-paced
content platforms this category will eventually include (bounded by
cohort/instructor capacity rather than infinitely scalable). See
`business-library/technology/cohort-based-coding-bootcamp/` for the
full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| online-course-platforms | Cohort-Based Coding Bootcamp | cohort-based-coding-bootcamp | education | service | P2 | high | Medium | No | moderate | Yes | ✅ |
| online-course-platforms | Self-Paced Language Learning Platform | self-paced-language-platform | education | saas | P2 | high | High | No | high | Yes | |
| online-course-platforms | Professional Certification Prep Platform | professional-certification-platform | education | saas | P2 | moderate | Medium | No | high | No | |
| online-course-platforms | Kids' Online Coding Academy | kids-online-coding-academy | education | subscription | P2 | moderate | Medium | No | moderate | No | |
| online-course-platforms | Music Lesson Subscription Platform | music-lesson-subscription-platform | education | subscription | P3 | moderate | Medium | Yes | moderate | No | |
| online-course-platforms | Test Prep Video Course Platform | test-prep-video-course-platform | education | content | P3 | moderate | Low | Yes | moderate | No | |
| online-course-platforms | Corporate Upskilling Course Platform | corporate-upskilling-platform | education | saas | P2 | high | High | No | high | Yes | |
| online-course-platforms | Cooking Skills Video Course Platform | cooking-skills-course-platform | education | content | P3 | low | Low | Yes | moderate | No | |
| online-course-platforms | Creative Writing Workshop Platform | creative-writing-workshop-platform | education | content | P3 | moderate | Low | Yes | moderate | No | |
| online-course-platforms | Trades & Certification Skills Platform | trades-certification-platform | education | saas | P3 | moderate | Medium | No | high | No | |

## `sustainable-fashion-brands`

*Knowledge Authoring Batch 8 (2026-07-15) authored this category's
first candidate — Upcycled Denim Label — bringing the authored count
to 1 of 9. Positioned around limited-run drops sewn from reclaimed
denim (own take-back program plus textile-recycler sourcing), sold
direct-to-consumer with a secondary wholesale channel. See
`business-library/technology/upcycled-denim-label/` for the full
package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| sustainable-fashion-brands | Upcycled Denim Label | upcycled-denim-label | fashion | physicalProduct | P2 | moderate | Medium | Yes | moderate | No | ✅ |
| sustainable-fashion-brands | Organic Cotton Basics Brand | organic-cotton-basics-brand | fashion | ecommerce | P2 | moderate | Medium | Yes | high | No | ✅ |
| sustainable-fashion-brands | Circular Fashion Rental Platform | circular-fashion-rental-platform | fashion | subscription | P2 | high | High | No | moderate | Yes | |
| sustainable-fashion-brands | Sustainable Activewear Brand | sustainable-activewear-brand | fashion | ecommerce | P2 | moderate | Medium | Yes | moderate | No | |
| sustainable-fashion-brands | Zero-Waste Accessories Studio | zero-waste-accessories-studio | fashion | physicalProduct | P3 | moderate | Low | Yes | low | No | |
| sustainable-fashion-brands | Deadstock Fabric Fashion Label | deadstock-fabric-fashion-label | fashion | physicalProduct | P3 | moderate | Medium | Yes | moderate | No | |
| sustainable-fashion-brands | Ethical Footwear Brand | ethical-footwear-brand | fashion | ecommerce | P3 | moderate | Medium | Yes | moderate | No | |
| sustainable-fashion-brands | Secondhand Fashion Resale Marketplace | secondhand-fashion-resale-marketplace | fashion | marketplace | P2 | high | Medium | No | high | No | |
| sustainable-fashion-brands | Sustainable Kidswear Brand | sustainable-kidswear-brand | fashion | ecommerce | P3 | moderate | Medium | Yes | moderate | No | |

## `local-service-marketplaces`

*Industry varies per business (per §5.2 of the mapping report), `businessModel` fixed to `marketplace`.*

*Knowledge Authoring Batch 7 (2026-07-15) authored this category's
second P2 candidate — Home Repair & Handyman Marketplace — the
library's second genuine two-sided marketplace, after
`tutoring-help-marketplace`. Deliberately differentiated from it:
quote-based job pricing instead of session booking, contractor
licensing/insurance verification instead of background-check-only
vetting, a larger average transaction size, and a job-guarantee
insurance angle instead of a minor-safety angle. See
`business-library/technology/home-repair-marketplace/` for the full
package.*

*Knowledge Authoring Batch 9 (2026-07-15) authored this category's
third P2 candidate — Personal Trainer Booking Marketplace — the
library's third genuine two-sided marketplace. Deliberately
differentiated from both `tutoring-help-marketplace` and
`home-repair-marketplace`: session-based booking like tutoring, but
with home-repair's seriousness of liability verification — trainers
must carry NASM/ACE/ISSA-tier certification plus professional
liability insurance covering physical-injury risk, a distinct risk
category from both tutoring's minor-safety angle and home-repair's
property-damage angle — plus a unique gym-and-studio-partnership
supply channel. See
`business-library/technology/personal-trainer-marketplace/` for the
full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| local-service-marketplaces | Home Repair & Handyman Marketplace | home-repair-marketplace | homeServices | marketplace | P2 | high | High | No | high | Yes | ✅ |
| local-service-marketplaces | Personal Trainer Booking Marketplace | personal-trainer-marketplace | health | marketplace | P2 | high | High | No | high | Yes | ✅ |
| local-service-marketplaces | Tutoring & Homework Help Marketplace | tutoring-help-marketplace | education | marketplace | P2 | high | High | No | high | Yes | ✅ |
| local-service-marketplaces | Pet Care Services Marketplace | pet-care-services-marketplace | homeServices | marketplace | P3 | high | High | No | high | Yes | |
| local-service-marketplaces | Freelance Bookkeeping Marketplace | freelance-bookkeeping-marketplace | professionalServices | marketplace | P3 | high | High | No | high | Yes | |
| local-service-marketplaces | House Cleaning Services Marketplace | house-cleaning-marketplace | homeServices | marketplace | P2 | high | Medium | No | high | Yes | |
| local-service-marketplaces | Event & Photography Services Marketplace | event-photography-marketplace | entertainment | marketplace | P3 | high | Medium | No | high | Yes | |
| local-service-marketplaces | Landscaping & Yard Care Marketplace | landscaping-yard-care-marketplace | homeServices | marketplace | P3 | high | Medium | No | high | Yes | |
| local-service-marketplaces | Freelance Tech Support Marketplace | freelance-tech-support-marketplace | tech | marketplace | P3 | high | High | No | high | Yes | |

## `boutique-travel-agencies`

*Knowledge Authoring Batch 6 (2026-07-15) authored this category's
first P2 candidate — Adventure Travel Boutique Agency — the first
business authored under this category. The only business in the
library with a genuine, frequent personal-travel requirement, reflecting
the founder's own firsthand destination and guide-network expertise.
See `business-library/technology/adventure-travel-boutique-agency/`
for the full package.*

*Knowledge Authoring Batch 10 (2026-07-15) authored this category's
second P2 candidate — Luxury Honeymoon Planning Agency — bringing the
authored count to 2 of 8. Deliberately differentiated from Adventure
Travel Boutique Agency: a romantic/luxury occasion at a materially
higher price tier (€8,000-€25,000+ per couple vs. €2,500-€6,000 per
person) rather than an adventure/expedition occasion, luxury-resort
and DMC preferred-partner relationships rather than firsthand
guide-network expertise, and a wedding-industry vendor referral
channel rather than an outdoor-adventure-community channel. See
`business-library/technology/luxury-honeymoon-planning-agency/` for
the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| boutique-travel-agencies | Adventure Travel Boutique Agency | adventure-travel-boutique-agency | travel | agency | P2 | moderate | Medium | Yes | moderate | No | ✅ |
| boutique-travel-agencies | Luxury Honeymoon Planning Agency | luxury-honeymoon-planning-agency | travel | agency | P2 | moderate | Medium | Yes | moderate | No | ✅ |
| boutique-travel-agencies | Solo Female Travel Agency | solo-female-travel-agency | travel | agency | P3 | moderate | Low | Yes | moderate | No | |
| boutique-travel-agencies | Culinary Tour Operator | culinary-tour-operator | travel | service | P3 | moderate | Medium | Yes | moderate | No | |
| boutique-travel-agencies | Sustainable Eco-Tourism Agency | sustainable-ecotourism-agency | sustainability | agency | P3 | moderate | Medium | Yes | moderate | No | |
| boutique-travel-agencies | Destination Wedding Planning Agency | destination-wedding-planning-agency | travel | agency | P3 | moderate | Medium | Yes | moderate | No | |
| boutique-travel-agencies | Group Wellness Retreat Travel Agency | wellness-retreat-travel-agency | health | agency | P3 | moderate | Medium | Yes | moderate | No | |
| boutique-travel-agencies | Corporate Incentive Travel Agency | corporate-incentive-travel-agency | travel | agency | P2 | high | High | No | moderate | Yes | |

## `niche-content-studios`

*Uses `mediaProduction` as the primary industry — per §6 of the mapping report, this is the exact category `mediaProduction` was added to fit.*

*Knowledge Authoring Batch 8 (2026-07-15) authored this category's
first candidate — Independent Podcast Production Studio — bringing
the authored count to 1 of 9. Positioned around a show-launch package
converting into a recurring per-episode production retainer, with
referrals from past podcast guests and co-producers as the primary
acquisition channel. See
`business-library/technology/independent-podcast-production-studio/`
for the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| niche-content-studios | Independent Podcast Production Studio | independent-podcast-production-studio | mediaProduction | content | P2 | moderate | Low | Yes | moderate | No | ✅ |
| niche-content-studios | YouTube Channel Production Agency | youtube-channel-production-agency | mediaProduction | agency | P2 | moderate | Low | Yes | moderate | No | |
| niche-content-studios | Niche Documentary Production Studio | niche-documentary-production-studio | mediaProduction | service | P3 | high | High | No | low | Yes | |
| niche-content-studios | Branded Video Content Studio | branded-video-content-studio | mediaProduction | agency | P2 | moderate | Medium | Yes | moderate | No | |
| niche-content-studios | Voiceover & Audio Production Studio | voiceover-audio-production-studio | mediaProduction | service | P3 | moderate | Low | Yes | low | No | |
| niche-content-studios | Animation Explainer Video Studio | animation-explainer-video-studio | mediaProduction | agency | P3 | high | Medium | No | moderate | Yes | |
| niche-content-studios | Niche Newsletter & Content Publishing Studio | niche-newsletter-publishing-studio | mediaProduction | content | P2 | moderate | Low | Yes | moderate | No | |
| niche-content-studios | Livestream Production & Events Studio | livestream-production-studio | mediaProduction | service | P3 | moderate | Medium | Yes | moderate | No | |
| niche-content-studios | Stock Footage & B-Roll Production Studio | stock-footage-production-studio | mediaProduction | content | P3 | moderate | Low | Yes | moderate | No | |

## `accounting-firms`

*Knowledge Authoring Batch 6 (2026-07-15) authored this category's
first P2 candidate — Cloud Bookkeeping Service for Startups — deliberately
differentiated from the existing `accounting-firm` P1 package: fully
remote vs. hybrid, flat-tier pricing vs. transaction-volume pricing, an
accelerator/VC referral channel vs. a lawyer/consultant referral
channel, and investor-reporting/burn-rate/runway fluency vs. general
month-end-close speed. Regulated accounting content — the same
educational-framing discipline established for the Professional
Services batch applies. See
`business-library/technology/cloud-bookkeeping-startups/` for the full
package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| accounting-firms | Accounting Firm | accounting-firm | finance | service | P1 | moderate | Medium | Yes | moderate | No | ✅ |
| accounting-firms | Cloud Bookkeeping Service for Startups | cloud-bookkeeping-startups | finance | service | P2 | moderate | Low | Yes | moderate | No | ✅ |
| accounting-firms | Nonprofit Accounting Practice | nonprofit-accounting-practice | finance | service | P3 | moderate | Medium | Yes | moderate | No | |
| accounting-firms | E-commerce Accounting Specialist Firm | ecommerce-accounting-specialist-firm | finance | service | P2 | moderate | Medium | Yes | moderate | No | |
| accounting-firms | Fractional CFO & Bookkeeping Practice | fractional-cfo-bookkeeping-practice | finance | service | P2 | high | Medium | Yes | moderate | Yes | |
| accounting-firms | Real Estate Accounting Practice | real-estate-accounting-practice | finance | service | P3 | moderate | Medium | Yes | moderate | No | |

## `financial-consultancies`

*Knowledge Authoring Batch 8 (2026-07-15) authored this category's
first P2 candidate — Fee-Only Financial Planning Practice — bringing
the authored count to 2 of 6. Regulated financial-advisory content,
framed with the same educational-guidance discipline as Financial
Consultancy (business-planning content only, never advice resembling
actual investment or financial guidance), and deliberately
differentiated from it: flat-fee/no-AUM pricing vs. Financial
Consultancy's AUM-fee model, fully remote vs. hybrid, younger
high-earner clients seeking a one-time plan or annual retainer vs.
Financial Consultancy's pre-retirees and business-owner exit-planning
focus, and content/SEO-driven acquisition vs. Financial Consultancy's
referral network of accountants and estate attorneys. See
`business-library/technology/fee-only-financial-planning-practice/`
for the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| financial-consultancies | Financial Consultancy | financial-consultancy | finance | service | P1 | high | High | Yes | high | Yes | ✅ |
| financial-consultancies | Fee-Only Financial Planning Practice | fee-only-financial-planning-practice | finance | service | P2 | high | Medium | Yes | moderate | Yes | ✅ |
| financial-consultancies | Retirement Planning Advisory | retirement-planning-advisory | finance | service | P2 | high | Medium | Yes | moderate | Yes | |
| financial-consultancies | Wealth Management Boutique for Tech Employees | wealth-management-boutique-tech | finance | service | P3 | high | High | No | moderate | Yes | |
| financial-consultancies | Small Business Financial Advisory | small-business-financial-advisory | finance | service | P3 | moderate | Medium | Yes | moderate | No | |
| financial-consultancies | Startup Fundraising & Financial Modeling Consultancy | startup-fundraising-modeling-consultancy | finance | service | P2 | high | Medium | Yes | moderate | Yes | |

## `insurance-brokerages`

*Knowledge Authoring Batch 10 (2026-07-15) authored this category's
first P2 candidate — Independent P&C Insurance Brokerage — bringing
the authored count to 2 of 6. Regulated insurance-sales content,
framed with the same educational-guidance discipline as Insurance
Brokerage, and deliberately differentiated from it: a specific niche
(landlord/rental-property portfolios) rather than general personal
lines, a portfolio-coverage-gap-review sales approach rather than a
general "shop it for you across carriers" approach, and a dual
commission-plus-surplus-lines-broker-fee revenue model rather than a
purely commission-only model. See
`business-library/technology/independent-pc-insurance-brokerage/` for
the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| insurance-brokerages | Insurance Brokerage | insurance-brokerage | finance | agency | P1 | moderate | Medium | Yes | high | No | ✅ |
| insurance-brokerages | Independent P&C Insurance Brokerage | independent-pc-insurance-brokerage | finance | agency | P2 | moderate | Medium | Yes | high | No | ✅ |
| insurance-brokerages | Life Insurance Brokerage for Young Families | life-insurance-brokerage-young-families | finance | agency | P3 | moderate | Low | Yes | moderate | No | |
| insurance-brokerages | Commercial Insurance Brokerage for SMBs | commercial-insurance-brokerage-smb | finance | agency | P2 | high | Medium | Yes | high | Yes | |
| insurance-brokerages | Health Insurance Brokerage | health-insurance-brokerage | health | agency | P3 | moderate | Medium | Yes | moderate | No | |
| insurance-brokerages | Specialty & Niche Risk Insurance Brokerage | specialty-niche-risk-insurance-brokerage | finance | agency | P3 | high | High | No | moderate | Yes | |

## `tax-consultancies`

*Knowledge Authoring Batch 9 (2026-07-15) authored this category's
first P2 candidate — Expat Tax Advisory Practice — bringing the
authored count to 2 of 6. Regulated tax-advisory content, framed with
the same educational-guidance discipline as Tax Consultancy, and
deliberately differentiated from it: a cross-border, year-round
compliance niche rather than a domestic, calendar-year-concentrated
practice — fully remote rather than hybrid, an annual dual-country
compliance retainer rather than a purely seasonal engagement
(`isSeasonalBusiness: false` vs. `true`), an expat-community/
relocation-firm referral channel rather than local-accountant
referrals plus local SEO, and materially higher liability stakes given
FBAR/FATCA non-compliance penalty exposure. See
`business-library/technology/expat-tax-advisory-practice/` for the
full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| tax-consultancies | Tax Consultancy | tax-consultancy | finance | service | P1 | moderate | Medium | Yes | moderate | No | ✅ |
| tax-consultancies | Expat Tax Advisory Practice | expat-tax-advisory-practice | finance | service | P2 | high | Medium | Yes | moderate | Yes | ✅ |
| tax-consultancies | Small Business Tax Prep Practice | small-business-tax-prep-practice | finance | service | P2 | moderate | Low | Yes | moderate | No | |
| tax-consultancies | Crypto Tax Compliance Consultancy | crypto-tax-compliance-consultancy | finance | service | P2 | high | Medium | Yes | moderate | Yes | |
| tax-consultancies | Real Estate Investor Tax Practice | real-estate-investor-tax-practice | finance | service | P3 | moderate | Medium | Yes | moderate | No | |
| tax-consultancies | Sales Tax & Multi-State Compliance Practice | sales-tax-multistate-compliance-practice | finance | service | P3 | high | Medium | Yes | moderate | Yes | |

## `law-firms`

*Knowledge Authoring Batch 7 (2026-07-15) authored this category's
first P2 candidate — Boutique IP Law Practice — deliberately
differentiated from the existing `law-firm` P1 package: patent-bar-
qualified IP specialization vs. general business-law practice, fully
remote vs. hybrid, flat-fee/hourly split by matter type vs. blended
hourly/GC-retainer pricing, and accelerator/VC portfolio referrals vs.
accountant/consultant referrals. Regulated legal content — the same
educational-framing discipline established for the Professional
Services batch applies. See
`business-library/technology/boutique-ip-law-practice/` for the full
package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| law-firms | Law Firm | law-firm | professionalServices | service | P1 | high | High | Yes | low | Yes | ✅ |
| law-firms | Boutique IP Law Practice | boutique-ip-law-practice | professionalServices | service | P2 | high | High | Yes | low | Yes | ✅ |
| law-firms | Immigration Law Practice | immigration-law-practice | professionalServices | service | P2 | moderate | Medium | Yes | moderate | No | |
| law-firms | Startup & Contracts Law Practice | startup-contracts-law-practice | professionalServices | service | P2 | high | Medium | Yes | moderate | Yes | |
| law-firms | Family Law Mediation Practice | family-law-mediation-practice | professionalServices | service | P3 | moderate | Medium | Yes | moderate | No | |
| law-firms | Estate Planning Law Practice | estate-planning-law-practice | professionalServices | service | P3 | high | Medium | Yes | moderate | Yes | |
| law-firms | Employment Law Advisory Practice | employment-law-advisory-practice | professionalServices | service | P3 | high | Medium | Yes | moderate | Yes | |

## `hr-consultancies`

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| hr-consultancies | HR Consultancy | hr-consultancy | professionalServices | service | P1 | moderate | Medium | Yes | moderate | No | ✅ |
| hr-consultancies | Remote-First HR Advisory | remote-first-hr-advisory | professionalServices | service | P2 | moderate | Medium | Yes | moderate | No | |
| hr-consultancies | Compensation & Benefits Consultancy | compensation-benefits-consultancy | professionalServices | service | P2 | high | Medium | Yes | moderate | Yes | |
| hr-consultancies | DEI & Culture Consultancy | dei-culture-consultancy | professionalServices | service | P3 | moderate | Low | Yes | moderate | No | |
| hr-consultancies | HR Compliance Audit Practice | hr-compliance-audit-practice | professionalServices | service | P3 | high | Medium | Yes | moderate | Yes | |
| hr-consultancies | People Analytics Consultancy | people-analytics-consultancy | professionalServices | service | P3 | high | Medium | Yes | moderate | Yes | |

## `recruitment-agencies`

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| recruitment-agencies | Recruitment Agency | recruitment-agency | professionalServices | service | P1 | moderate | Medium | Yes | high | No | ✅ |
| recruitment-agencies | Tech Recruitment Agency | tech-recruitment-agency | tech | agency | P2 | moderate | Medium | Yes | high | No | ✅ |
| recruitment-agencies | Executive Search Firm | executive-search-firm | professionalServices | agency | P2 | high | High | No | moderate | Yes | |
| recruitment-agencies | Healthcare Staffing Agency | healthcare-staffing-agency | health | agency | P2 | high | Medium | No | high | Yes | |
| recruitment-agencies | Contingent & Temp Staffing Platform | contingent-temp-staffing-platform | professionalServices | marketplace | P3 | high | High | No | high | Yes | |
| recruitment-agencies | Sales Recruitment Agency | sales-recruitment-agency | professionalServices | agency | P3 | moderate | Medium | Yes | high | No | |
| recruitment-agencies | Creative & Design Talent Agency | creative-design-talent-agency | mediaProduction | agency | P3 | moderate | Medium | Yes | moderate | No | |

## `business-consultancies`

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| business-consultancies | Business Consultancy | business-consultancy | professionalServices | service | P1 | moderate | High | Yes | moderate | Yes | ✅ |
| business-consultancies | Operations Consultancy for E-commerce Brands | operations-consultancy-ecommerce | professionalServices | service | P2 | high | Medium | Yes | moderate | Yes | |
| business-consultancies | Turnaround & Restructuring Consultancy | turnaround-restructuring-consultancy | professionalServices | service | P3 | high | High | No | low | Yes | |
| business-consultancies | Growth Strategy Consultancy for SaaS | growth-strategy-consultancy-saas | tech | service | P2 | high | Medium | Yes | moderate | Yes | |
| business-consultancies | Process Automation Consultancy | process-automation-consultancy | professionalServices | service | P3 | moderate | Medium | Yes | moderate | No | |
| business-consultancies | Change Management Consultancy | change-management-consultancy | professionalServices | service | P3 | high | Medium | Yes | moderate | Yes | |
| business-consultancies | Family Business Succession Consultancy | family-business-succession-consultancy | professionalServices | service | P3 | high | Medium | No | low | Yes | |

---

## `marketing-agencies`

*New category added 2026-07-10 (Taxonomy Synchronization). Flagship P1 entry only — batch expansion deferred.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| marketing-agencies | Marketing Agency | marketing-agency | tech | agency | P1 | moderate | Low | Yes | moderate | No | ✅ |

## `ecommerce`

*New category added 2026-07-10. No fixed `industry` default at the category level (see `categories.json`) — `fashion` used below as a representative example for this flagship entry; per real authored business, `industry` must be set to the actual vertical sold (food, health, fashion, etc.), same pattern as `subscription-boxes`.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ecommerce | E-commerce Brand | ecommerce-brand | fashion | ecommerce | P1 | moderate | Medium | Yes | moderate | No | ✅ |

## `coaching`

*New category added 2026-07-10. Default `industry` is `professionalServices` (business/career/executive coaching archetype); `education` is a valid per-business override for skills/learning-focused coaching (see `categories.json`).*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| coaching | Coaching Business | coaching-business | professionalServices | service | P1 | moderate | Low | Yes | moderate | No | ✅ |

## `architecture`

*New category added 2026-07-10.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| architecture | Architecture Studio | architecture-studio | professionalServices | service | P1 | high | High | Yes | low | Yes | ✅ |

## `real-estate`

*New category added 2026-07-10. `homeServices` is the closest existing `IndustryType` fit — a lossy mapping (per the same conflation pattern flagged for `local-service-marketplaces`), not an exact vertical match.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| real-estate | Real Estate Agency | real-estate-agency | homeServices | agency | P1 | moderate | Medium | Yes | moderate | No | ✅ |

## `cleaning-services`

*New category added 2026-07-10. Distinct from `local-service-marketplaces`' "House Cleaning Services Marketplace" — this is a single operating company (`service`), not a marketplace aggregating independent providers.*

*Knowledge Authoring Batch 4 (2026-07-14) authored this category's
flagship P1 candidate — Cleaning Company — the first business authored
under this category. See `business-library/technology/cleaning-company/`
for the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| cleaning-services | Cleaning Company | cleaning-company | homeServices | service | P1 | moderate | Low | Yes | low | No | ✅ |

## `beauty-wellness`

*New category added 2026-07-10.*

*Knowledge Authoring Batch 4 (2026-07-14) authored this category's
flagship P1 candidate — Beauty Salon — the first business authored under
this category. `health` is a deliberately acknowledged loose IndustryType
fit for this business, per the earlier Industry Mapping Report
reconciliation. See `business-library/technology/beauty-salon/` for the
full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| beauty-wellness | Beauty Salon | beauty-salon | health | service | P1 | moderate | Medium | No | low | No | ✅ |

## `dental-clinics`

*New category added 2026-07-10. Regulated/licensed clinical practice — apply the same educational-framing discipline established for the Professional Services batch (law-firm, accounting-firm, etc.) at authoring time; nothing here implies unlicensed practice.*

*Knowledge Authoring Batch 4 (2026-07-14) authored this category's
flagship P1 candidate — Dental Clinic — the first business authored
under this category. Business-planning content only, with no clinical
treatment protocols or diagnostic guidance anywhere in the package. See
`business-library/technology/dental-clinic/` for the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| dental-clinics | Dental Clinic | dental-clinic | health | service | P1 | high | Very High | No | low | Yes | ✅ |

## `veterinary-clinics`

*New category added 2026-07-10. Regulated/licensed clinical practice — same educational-framing discipline as `dental-clinics` applies at authoring time.*

*Knowledge Authoring Batch 4 (2026-07-14) authored this category's
flagship P1 candidate — Veterinary Clinic — the first business authored
under this category. Business-planning content only, with no clinical
treatment protocols or diagnostic guidance anywhere in the package;
differentiated from `dental-clinics` by a recurring wellness-plan
subscription and animal (not human) patients. See
`business-library/technology/veterinary-clinic/` for the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| veterinary-clinics | Veterinary Clinic | veterinary-clinic | health | service | P1 | high | Very High | No | low | Yes | ✅ |

## `psychology-practices`

*New category added 2026-07-10. Regulated/licensed clinical practice — same educational-framing discipline as `dental-clinics` applies at authoring time.*

*Knowledge Authoring Batch 4 (2026-07-14) authored this category's
flagship P1 candidate — Psychology Practice — the first business authored
under this category. Business-planning content only, with no clinical
treatment modalities, diagnostic criteria, or intervention techniques
anywhere in the package, and no clinical claims beyond what a real
practice would state in its own marketing; the only one of the three
Batch 4 licensed healthcare-adjacent businesses that is genuinely
solo-founder-friendly and low-budget. See
`business-library/technology/psychology-practice/` for the full
package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| psychology-practices | Psychology Practice | psychology-practice | health | service | P1 | moderate | Low | Yes | low | No | ✅ |

## `coffee-shops`

*New category added 2026-07-10. Distinct from `subscription-boxes`' "Specialty Coffee Subscription Box" — this is a physical dine-in/retail venue (`physicalProduct`), not a recurring shipped box (`subscription`).*

*Knowledge Authoring Batch 5 (2026-07-15, final batch for the 12 new
canonical categories) authored this category's flagship P1 candidate —
Coffee Shop — the first business authored under this category.
Differentiated from `restaurants` elsewhere in this catalog (also a
physical food-service location) by a simpler counter-service menu,
faster per-transaction service, no full commercial kitchen or table
service, and lower staffing and capital requirements. See
`business-library/technology/coffee-shop/` for the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| coffee-shops | Coffee Shop | coffee-shop | food | physicalProduct | P1 | moderate | Medium | No | low | No | ✅ |

## `restaurants`

*New category added 2026-07-10.*

*Knowledge Authoring Batch 5 (2026-07-15, final batch for the 12 new
canonical categories) authored this category's flagship P1 candidate —
Restaurant — the first business authored under this category.
Differentiated from `coffee-shops` elsewhere in this catalog (also a
physical food-service location) by a full commercial kitchen, a much
larger front-of-house and back-of-house staff, liquor licensing on top
of standard food-service permitting, the highest startup capital and
thinnest margins of the two, and a private-event/catering booking
revenue stream as its premium differentiator. See
`business-library/technology/restaurant/` for the full package.*

| Category | Business Name | Slug | IndustryType | BusinessModel | Launch Priority | Difficulty | Startup Budget Tier | Solo Friendly | Scalability | Premium Package | Already Authored |
|---|---|---|---|---|---|---|---|---|---|---|---|
| restaurants | Restaurant | restaurant | food | physicalProduct | P1 | high | High | No | low | Yes | ✅ |

---

## What this catalog does not do

- Does not add consuming logic anywhere (Matching Engine, Blueprint,
  Marketing, KPIs still read nothing from this file).
- Does not create or modify any `business-library/` folder,
  `metadata.json`, or Business Genome/BusinessDnaProfile document.
- Does not modify `prisma/schema.prisma`, any Zod enum schema, or
  `business-library/taxonomy/categories.json`.
- Does not change the count or membership of any of the three
  vocabularies it draws from — every value used already existed before
  this file was written.
